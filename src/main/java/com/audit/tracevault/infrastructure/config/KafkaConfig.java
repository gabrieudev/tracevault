package com.audit.tracevault.infrastructure.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.audit.tracevault.infrastructure.adapters.out.kafka.model.AuditLogEvent;

@Configuration
@EnableKafka
public class KafkaConfig {

        @Value("${spring.kafka.bootstrap-servers}")
        private String bootstrapServers;

        @Bean
        ProducerFactory<String, AuditLogEvent> producerFactory() {
                Map<String, Object> props = new HashMap<>();

                props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
                props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
                props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

                return new DefaultKafkaProducerFactory<>(props);
        }

        @Bean
        KafkaTemplate<String, AuditLogEvent> kafkaTemplate() {
                return new KafkaTemplate<>(producerFactory());
        }

        @Bean
        ConsumerFactory<String, AuditLogEvent> consumerFactory() {
                JsonDeserializer<AuditLogEvent> deserializer = new JsonDeserializer<>(AuditLogEvent.class);

                deserializer.addTrustedPackages("com.audit.tracevault");

                Map<String, Object> props = new HashMap<>();

                props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
                props.put(ConsumerConfig.GROUP_ID_CONFIG, "alert-engine");
                props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

                return new DefaultKafkaConsumerFactory<>(
                                props,
                                new StringDeserializer(),
                                deserializer);
        }

        @Bean(name = "kafkaListenerContainerFactory")
        ConcurrentKafkaListenerContainerFactory<String, AuditLogEvent> kafkaListenerContainerFactory() {
                ConcurrentKafkaListenerContainerFactory<String, AuditLogEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

                factory.setConsumerFactory(consumerFactory());

                return factory;
        }

        @Bean
        NewTopic auditLogCreatedTopic() {
                return TopicBuilder
                                .name("audit-log-created")
                                .partitions(3)
                                .replicas(1)
                                .build();
        }

}