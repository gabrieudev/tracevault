package com.audit.tracevault.infrastructure.adapters.out.persistence.repository;

import java.sql.Array;
import java.sql.SQLException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.core.domain.dashboard.impl.ActiveApplicationsDTOImpl;
import com.audit.tracevault.core.domain.dashboard.impl.ApplicationVolumeDTOImpl;
import com.audit.tracevault.core.domain.dashboard.impl.AuditPulseDTOImpl;
import com.audit.tracevault.core.domain.dashboard.impl.RecentEventDTOImpl;
import com.audit.tracevault.core.domain.dashboard.impl.StatMetricDTOImpl;
import com.audit.tracevault.core.domain.dashboard.interfaces.ActiveApplicationsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.ApplicationVolumeDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.AuditPulseDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardTrendEnum;
import com.audit.tracevault.core.domain.dashboard.interfaces.RecentEventDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.StatMetricDTO;

@Repository
public class SpringDataDashboardRepository {

    private static final int DASHBOARD_LIMIT = 5;

    private final JdbcTemplate jdbcTemplate;

    public SpringDataDashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public ActiveApplicationsDTO getActiveApplications(UUID applicationId) {
        StringBuilder sql = new StringBuilder("""
                    SELECT
                        COUNT(*) FILTER (WHERE status = 'ACTIVE') AS active,
                        COUNT(*) AS total
                    FROM application
                """);

        List<Object> params = new ArrayList<>();

        if (applicationId != null) {
            sql.append(" WHERE id = ?");
            params.add(applicationId);
        }

        return jdbcTemplate.queryForObject(
                sql.toString(),
                (rs, rowNum) -> new ActiveApplicationsDTOImpl(
                        rs.getInt("active"),
                        rs.getInt("total")),
                params.toArray());
    }

    public List<ApplicationVolumeDTO> getApplicationsVolume(UUID applicationId) {
        StringBuilder sql = new StringBuilder("""
                    SELECT
                        a.name,
                        COUNT(l.id) AS events_count,
                        ROUND(
                            COUNT(l.id) * 100.0
                            / NULLIF((SELECT COUNT(*) FROM audit_log), 0)
                        ) AS percentage
                    FROM application a
                    LEFT JOIN audit_log l ON l.application_id = a.id
                """);

        List<Object> params = new ArrayList<>();

        if (applicationId != null) {
            sql.append(" WHERE a.id = ?");
            params.add(applicationId);
        }

        sql.append("""
                    GROUP BY a.id, a.name
                    ORDER BY events_count DESC
                    LIMIT ?
                """);

        params.add(DASHBOARD_LIMIT);

        return jdbcTemplate.query(
                sql.toString(),
                (rs, rowNum) -> new ApplicationVolumeDTOImpl(
                        rs.getString("name"),
                        rs.getInt("events_count"),
                        rs.getInt("percentage")),
                params.toArray());
    }

    public List<RecentEventDTO> getRecentEvents(UUID applicationId) {
        StringBuilder sql = new StringBuilder("""
                    SELECT
                        id,
                        action,
                        resource_type,
                        resource_id,
                        actor_name,
                        severity,
                        occurred_at
                    FROM audit_log
                """);

        List<Object> params = new ArrayList<>();

        if (applicationId != null) {
            sql.append(" WHERE application_id = ?");
            params.add(applicationId);
        }

        sql.append("""
                    ORDER BY occurred_at DESC
                    LIMIT ?
                """);

        params.add(DASHBOARD_LIMIT);

        return jdbcTemplate.query(
                sql.toString(),
                (rs, rowNum) -> new RecentEventDTOImpl(
                        UUID.fromString(rs.getString("id")),
                        ActionEnum.valueOf(rs.getString("action")),
                        rs.getString("resource_type"),
                        rs.getString("resource_id"),
                        rs.getString("actor_name"),
                        SeverityEnum.valueOf(rs.getString("severity")),
                        rs.getTimestamp("occurred_at").toInstant()),
                params.toArray());
    }

    public Instant getLastLogTimestamp(UUID applicationId) {
        StringBuilder sql = new StringBuilder("""
                    SELECT MAX(occurred_at) AS last_log_timestamp
                    FROM audit_log
                """);

        List<Object> params = new ArrayList<>();

        if (applicationId != null) {
            sql.append(" WHERE application_id = ?");
            params.add(applicationId);
        }

        return jdbcTemplate.queryForObject(
                sql.toString(),
                (rs, rowNum) -> {
                    java.sql.Timestamp timestamp = rs.getTimestamp("last_log_timestamp");

                    return timestamp != null
                            ? timestamp.toInstant()
                            : null;
                },
                params.toArray());
    }

    public StatMetricDTO getEventsToday(UUID applicationId) {
        StringBuilder sql = new StringBuilder("""
                    SELECT
                        COUNT(*) AS value,
                        '+0%' AS delta,
                        'FLAT' AS trend
                    FROM audit_log
                    WHERE occurred_at >= CURRENT_DATE
                """);

        List<Object> params = new ArrayList<>();

        if (applicationId != null) {
            sql.append(" AND application_id = ?");
            params.add(applicationId);
        }

        return jdbcTemplate.queryForObject(
                sql.toString(),
                (rs, rowNum) -> new StatMetricDTOImpl(
                        rs.getInt("value"),
                        rs.getString("delta"),
                        DashboardTrendEnum.valueOf(rs.getString("trend"))),
                params.toArray());
    }

    public StatMetricDTO getCriticalAlerts24h(
            UUID applicationId,
            int pulseWindowMinutes) {

        StringBuilder sql = new StringBuilder("""
                    SELECT
                        COUNT(*) AS value,
                        '0%' AS delta,
                        'FLAT' AS trend
                    FROM audit_log
                    WHERE severity = 'CRITICAL'
                      AND occurred_at >= NOW() - (? * INTERVAL '1 minute')
                """);

        List<Object> params = new ArrayList<>();
        params.add(pulseWindowMinutes);

        if (applicationId != null) {
            sql.append(" AND application_id = ?");
            params.add(applicationId);
        }

        return jdbcTemplate.queryForObject(
                sql.toString(),
                (rs, rowNum) -> new StatMetricDTOImpl(
                        rs.getInt("value"),
                        rs.getString("delta"),
                        DashboardTrendEnum.valueOf(rs.getString("trend"))),
                params.toArray());
    }

    public StatMetricDTO getLoginFailures24h(
            UUID applicationId,
            int pulseWindowMinutes) {

        StringBuilder sql = new StringBuilder("""
                    SELECT
                        COUNT(*) AS value,
                        '0%' AS delta,
                        'FLAT' AS trend
                    FROM audit_log
                    WHERE action = 'LOGIN_FAILED'
                      AND occurred_at >= NOW() - (? * INTERVAL '1 minute')
                """);

        List<Object> params = new ArrayList<>();
        params.add(pulseWindowMinutes);

        if (applicationId != null) {
            sql.append(" AND application_id = ?");
            params.add(applicationId);
        }

        return jdbcTemplate.queryForObject(
                sql.toString(),
                (rs, rowNum) -> new StatMetricDTOImpl(
                        rs.getInt("value"),
                        rs.getString("delta"),
                        DashboardTrendEnum.valueOf(rs.getString("trend"))),
                params.toArray());
    }

    public AuditPulseDTO getAuditPulse(
            UUID applicationId,
            int pulseWindowMinutes) {

        StringBuilder sql = new StringBuilder("""
                SELECT
                    array_agg(
                        to_char(t.bucket, 'YYYY-MM-DD HH24:MI')
                        ORDER BY t.bucket
                    ) AS timestamps,

                    array_agg(
                        COALESCE(l.cnt, 0)::int
                        ORDER BY t.bucket
                    ) AS data

                FROM (
                    SELECT generate_series(
                        date_trunc(
                            'hour',
                            NOW() - (? * INTERVAL '1 minute')
                        ),
                        date_trunc('hour', NOW()),
                        '1 hour'::interval
                    ) AS bucket
                ) t

                LEFT JOIN (
                    SELECT
                        date_trunc('hour', occurred_at) AS bucket,
                        COUNT(*) AS cnt
                    FROM audit_log
                    WHERE occurred_at >= NOW() - (? * INTERVAL '1 minute')
                """);

        List<Object> params = new ArrayList<>();

        params.add(pulseWindowMinutes);
        params.add(pulseWindowMinutes);

        if (applicationId != null) {
            sql.append("""
                        AND application_id = ?
                    """);

            params.add(applicationId);
        }

        sql.append("""
                    GROUP BY date_trunc('hour', occurred_at)
                ) l
                    ON t.bucket = l.bucket
                """);

        return jdbcTemplate.queryForObject(
                sql.toString(),
                (rs, rowNum) -> {

                    try {
                        Array timestampsArray = rs.getArray("timestamps");
                        Array dataArray = rs.getArray("data");

                        String[] timestamps = timestampsArray != null
                                ? (String[]) timestampsArray.getArray()
                                : new String[0];

                        Integer[] data;

                        if (dataArray != null) {
                            Object[] values = (Object[]) dataArray.getArray();

                            data = new Integer[values.length];

                            for (int i = 0; i < values.length; i++) {
                                data[i] = values[i] != null
                                        ? ((Number) values[i]).intValue()
                                        : 0;
                            }
                        } else {
                            data = new Integer[0];
                        }

                        return new AuditPulseDTOImpl(
                                timestamps,
                                data);

                    } catch (SQLException e) {
                        throw new RuntimeException(
                                "Erro ao mapear AuditPulseDTO",
                                e);
                    }
                },
                params.toArray());
    }
}