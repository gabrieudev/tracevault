CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE application_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE audit_severity AS ENUM ('INFO', 'WARNING', 'CRITICAL');
CREATE TYPE channel_type AS ENUM ('EMAIL', 'SLACK', 'DISCORD', 'WEBHOOK');

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only: % is not allowed', TG_OP
    USING ERRCODE = 'insufficient_privilege';
END;
$$;

CREATE TABLE application (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name            varchar(150) NOT NULL,
    description     text,
    api_key_hash    text NOT NULL,
    status          application_status NOT NULL DEFAULT 'ACTIVE',
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_application_api_key_hash UNIQUE (api_key_hash)
);

CREATE TRIGGER trg_application_touch_updated_at
BEFORE UPDATE ON application
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();

CREATE INDEX idx_application_status ON application (status);

CREATE TABLE audit_log (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id   uuid NOT NULL,
    actor_id         text NOT NULL,
    actor_name       text,
    actor_ip         text,
    actor_user_agent text,
    action           text NOT NULL,
    resource_type    text NOT NULL,
    resource_id      text NOT NULL,
    old_values       jsonb,
    new_values       jsonb,
    metadata         jsonb NOT NULL DEFAULT '{}'::jsonb,
    severity         audit_severity NOT NULL DEFAULT 'INFO',
    occurred_at      timestamptz NOT NULL,
    created_at       timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT fk_audit_log_application
        FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON DELETE RESTRICT
);

CREATE TRIGGER trg_audit_log_no_update
BEFORE UPDATE ON audit_log
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_mutation();

CREATE TRIGGER trg_audit_log_no_delete
BEFORE DELETE ON audit_log
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_mutation();

CREATE INDEX idx_audit_log_app_time
    ON audit_log (application_id, occurred_at DESC);

CREATE INDEX idx_audit_log_app_resource_time
    ON audit_log (application_id, resource_type, resource_id, occurred_at DESC);

CREATE INDEX idx_audit_log_app_actor_time
    ON audit_log (application_id, actor_id, occurred_at DESC);

CREATE INDEX idx_audit_log_app_severity_time
    ON audit_log (application_id, severity, occurred_at DESC);

CREATE INDEX idx_audit_log_occurred_at_brin
    ON audit_log USING brin (occurred_at);

CREATE INDEX idx_audit_log_metadata_gin
    ON audit_log USING gin (metadata jsonb_path_ops);

CREATE TABLE alert_rules (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id   uuid NOT NULL,
    endpoint_url     text NOT NULL,
    trigger_events   text[] NOT NULL,
    min_severity     audit_severity NOT NULL DEFAULT 'CRITICAL',
    channel_type     channel_type NOT NULL DEFAULT 'WEBHOOK',
    channel_config   jsonb NOT NULL DEFAULT '{}'::jsonb,
    message_template text,
    is_active        boolean NOT NULL DEFAULT true,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT fk_alert_rules_application
        FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_alert_rules_app_endpoint UNIQUE (application_id, endpoint_url)
);

CREATE TRIGGER trg_alert_rules_touch_updated_at
BEFORE UPDATE ON alert_rules
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();

CREATE INDEX idx_alert_rules_app_active
    ON alert_rules (application_id, is_active);

CREATE INDEX idx_alert_rules_trigger_events_gin
    ON alert_rules USING gin (trigger_events);

CREATE INDEX idx_alert_rules_active_only
    ON alert_rules (application_id)
    WHERE is_active = true;

REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM PUBLIC;