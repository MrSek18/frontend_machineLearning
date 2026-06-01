-- ============================================================
-- BASE DE DATOS: municipalidad_yau  (estructura + data)
-- Motor: MariaDB 10.4  |  Charset: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS `municipalidad_yau`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `municipalidad_yau`;

SET SQL_MODE    = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone   = "+00:00";
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- PARTE 1 — ESTRUCTURA
-- ============================================================

-- 1. estado_tramite
CREATE TABLE IF NOT EXISTS `estado_tramite` (
  `id`          tinyint(4)   NOT NULL AUTO_INCREMENT,
  `codigo`      varchar(40)  NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `activo`      tinyint(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_estado_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. prioridad_ml
CREATE TABLE IF NOT EXISTS `prioridad_ml` (
  `id`          tinyint(4)   NOT NULL AUTO_INCREMENT,
  `codigo`      varchar(20)  NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `nivel`       tinyint(4)   NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_prioridad_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. canal_notificacion
CREATE TABLE IF NOT EXISTS `canal_notificacion` (
  `id`     tinyint(4)  NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_canal_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. estado_notificacion
CREATE TABLE IF NOT EXISTS `estado_notificacion` (
  `id`     tinyint(4)  NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_estado_notif_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. tipo_documento
CREATE TABLE IF NOT EXISTS `tipo_documento` (
  `id`          tinyint(4)   NOT NULL AUTO_INCREMENT,
  `codigo`      varchar(50)  NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tipo_doc_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. area_municipal
CREATE TABLE IF NOT EXISTS `area_municipal` (
  `id`             char(36)     NOT NULL DEFAULT uuid(),
  `nombre`         varchar(100) NOT NULL,
  `responsable`    varchar(150) NOT NULL,
  `email_contacto` varchar(150) NOT NULL,
  `telefono`       varchar(20)  DEFAULT NULL,
  `activo`         tinyint(1)   NOT NULL DEFAULT 1,
  `created_at`     timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`     timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_area_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ciudadano
CREATE TABLE IF NOT EXISTS `ciudadano` (
  `id`               char(36)     NOT NULL DEFAULT uuid(),
  `dni`              char(8)      NOT NULL,
  `nombres`          varchar(100) NOT NULL,
  `apellidos`        varchar(100) NOT NULL,
  `email`            varchar(150) DEFAULT NULL,
  `telefono`         varchar(20)  DEFAULT NULL,
  `direccion`        varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date         DEFAULT NULL,
  `fecha_registro`   timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`       timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ciudadano_dni` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. tipo_tramite
CREATE TABLE IF NOT EXISTS `tipo_tramite` (
  `id`                  char(36)     NOT NULL DEFAULT uuid(),
  `nombre`              varchar(120) NOT NULL,
  `categoria`           varchar(80)  NOT NULL,
  `descripcion`         text         DEFAULT NULL,
  `dias_plazo`          int(11)      NOT NULL DEFAULT 15,
  `requiere_documentos` tinyint(1)   NOT NULL DEFAULT 1,
  `activo`              tinyint(1)   NOT NULL DEFAULT 1,
  `created_at`          timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tipo_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. usuario_municipalidad
CREATE TABLE IF NOT EXISTS `usuario_municipalidad` (
  `id`            char(36)     NOT NULL DEFAULT uuid(),
  `area_id`       char(36)     NOT NULL,
  `nombre`        varchar(150) NOT NULL,
  `email`         varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol`           enum('admin','supervisor','operador','ml_engineer') NOT NULL DEFAULT 'operador',
  `activo`        tinyint(1)   NOT NULL DEFAULT 1,
  `created_at`    timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`    timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_email` (`email`),
  KEY `fk_usuario_area` (`area_id`),
  CONSTRAINT `fk_usuario_area` FOREIGN KEY (`area_id`) REFERENCES `area_municipal` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. tramite
CREATE TABLE IF NOT EXISTS `tramite` (
  `id`                  char(36)     NOT NULL DEFAULT uuid(),
  `ciudadano_id`        char(36)     NOT NULL,
  `tipo_tramite_id`     char(36)     NOT NULL,
  `area_id`             char(36)     NOT NULL,
  `numero_expediente`   varchar(30)  NOT NULL COMMENT 'Formato: YAU-YYYY-NNNNNN',
  `estado_id`           tinyint(4)   NOT NULL DEFAULT 1,
  `prioridad_ml_id`     tinyint(4)   NOT NULL DEFAULT 1,
  `score_urgencia`      decimal(5,4) DEFAULT NULL,
  `descripcion`         text         DEFAULT NULL,
  `fecha_ingreso`       timestamp    NOT NULL DEFAULT current_timestamp(),
  `fecha_limite`        date         DEFAULT NULL,
  `fecha_cierre`        timestamp    NULL DEFAULT NULL,
  `usuario_asignado_id` char(36)     DEFAULT NULL,
  `created_at`          timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`          timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tramite_expediente` (`numero_expediente`),
  KEY `fk_tramite_ciudadano`  (`ciudadano_id`),
  KEY `fk_tramite_tipo`       (`tipo_tramite_id`),
  KEY `fk_tramite_area`       (`area_id`),
  KEY `fk_tramite_usuario`    (`usuario_asignado_id`),
  KEY `fk_tramite_estado`     (`estado_id`),
  KEY `fk_tramite_prioridad`  (`prioridad_ml_id`),
  KEY `idx_tramite_fecha`     (`fecha_ingreso`),
  CONSTRAINT `fk_tramite_ciudadano` FOREIGN KEY (`ciudadano_id`)        REFERENCES `ciudadano`            (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tramite_tipo`      FOREIGN KEY (`tipo_tramite_id`)     REFERENCES `tipo_tramite`         (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tramite_area`      FOREIGN KEY (`area_id`)             REFERENCES `area_municipal`       (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tramite_usuario`   FOREIGN KEY (`usuario_asignado_id`) REFERENCES `usuario_municipalidad`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tramite_estado`    FOREIGN KEY (`estado_id`)           REFERENCES `estado_tramite`       (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tramite_prioridad` FOREIGN KEY (`prioridad_ml_id`)     REFERENCES `prioridad_ml`         (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. documento
CREATE TABLE IF NOT EXISTS `documento` (
  `id`                  char(36)     NOT NULL DEFAULT uuid(),
  `tramite_id`          char(36)     NOT NULL,
  `tipo_documento_id`   tinyint(4)   NOT NULL,
  `nombre_archivo`      varchar(255) NOT NULL,
  `ruta_almacenamiento` varchar(500) NOT NULL,
  `tamano_bytes`        bigint(20)   DEFAULT NULL,
  `validado_ocr`        tinyint(1)   NOT NULL DEFAULT 0,
  `confianza_ocr`       decimal(5,4) DEFAULT NULL,
  `texto_extraido`      longtext     DEFAULT NULL,
  `fecha_subida`        timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_doc_tramite`   (`tramite_id`),
  KEY `fk_doc_tipo`      (`tipo_documento_id`),
  KEY `idx_doc_validado` (`validado_ocr`),
  CONSTRAINT `fk_doc_tramite` FOREIGN KEY (`tramite_id`)        REFERENCES `tramite`       (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_doc_tipo`    FOREIGN KEY (`tipo_documento_id`) REFERENCES `tipo_documento`(`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. historial_estado
CREATE TABLE IF NOT EXISTS `historial_estado` (
  `id`                 char(36)   NOT NULL DEFAULT uuid(),
  `tramite_id`         char(36)   NOT NULL,
  `estado_anterior_id` tinyint(4) DEFAULT NULL,
  `estado_nuevo_id`    tinyint(4) NOT NULL,
  `comentario`         text       DEFAULT NULL,
  `usuario_id`         char(36)   DEFAULT NULL,
  `fecha_cambio`       timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_hist_tramite`         (`tramite_id`),
  KEY `fk_hist_estado_anterior` (`estado_anterior_id`),
  KEY `fk_hist_estado_nuevo`    (`estado_nuevo_id`),
  KEY `fk_hist_usuario`         (`usuario_id`),
  KEY `idx_hist_fecha`          (`fecha_cambio`),
  CONSTRAINT `fk_hist_tramite`         FOREIGN KEY (`tramite_id`)         REFERENCES `tramite`             (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_hist_estado_anterior` FOREIGN KEY (`estado_anterior_id`) REFERENCES `estado_tramite`      (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_hist_estado_nuevo`    FOREIGN KEY (`estado_nuevo_id`)    REFERENCES `estado_tramite`      (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_hist_usuario`         FOREIGN KEY (`usuario_id`)         REFERENCES `usuario_municipalidad`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. notificacion
CREATE TABLE IF NOT EXISTS `notificacion` (
  `id`                     char(36)     NOT NULL DEFAULT uuid(),
  `tramite_id`             char(36)     NOT NULL,
  `ciudadano_id`           char(36)     NOT NULL,
  `canal_id`               tinyint(4)   NOT NULL,
  `estado_notificacion_id` tinyint(4)   NOT NULL DEFAULT 1,
  `asunto`                 varchar(200) DEFAULT NULL,
  `mensaje`                text         NOT NULL,
  `intentos`               tinyint(4)   NOT NULL DEFAULT 0,
  `fecha_envio`            timestamp    NULL DEFAULT NULL,
  `fecha_lectura`          timestamp    NULL DEFAULT NULL,
  `created_at`             timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_notif_tramite`   (`tramite_id`),
  KEY `fk_notif_ciudadano` (`ciudadano_id`),
  KEY `fk_notif_canal`     (`canal_id`),
  KEY `fk_notif_estado`    (`estado_notificacion_id`),
  CONSTRAINT `fk_notif_tramite`    FOREIGN KEY (`tramite_id`)             REFERENCES `tramite`             (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notif_ciudadano`  FOREIGN KEY (`ciudadano_id`)           REFERENCES `ciudadano`           (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notif_canal`      FOREIGN KEY (`canal_id`)               REFERENCES `canal_notificacion`  (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_notif_estado`     FOREIGN KEY (`estado_notificacion_id`) REFERENCES `estado_notificacion` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. prediccion_ml
CREATE TABLE IF NOT EXISTS `prediccion_ml` (
  `id`                  char(36)     NOT NULL DEFAULT uuid(),
  `tramite_id`          char(36)     NOT NULL,
  `modelo_usado`        varchar(80)  NOT NULL,
  `version_modelo`      varchar(20)  DEFAULT NULL,
  `score_prioridad`     decimal(5,4) NOT NULL,
  `tiempo_estimado_hrs` decimal(8,2) DEFAULT NULL,
  `prioridad_ml_id`     tinyint(4)   NOT NULL,
  `features_json`       longtext     CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features_json`)),
  `fecha_prediccion`    timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_pred_tramite`   (`tramite_id`),
  KEY `fk_pred_prioridad` (`prioridad_ml_id`),
  KEY `idx_pred_fecha`    (`fecha_prediccion`),
  CONSTRAINT `fk_pred_tramite`   FOREIGN KEY (`tramite_id`)    REFERENCES `tramite`    (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pred_prioridad` FOREIGN KEY (`prioridad_ml_id`) REFERENCES `prioridad_ml`(`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. feedback_ciudadano
CREATE TABLE IF NOT EXISTS `feedback_ciudadano` (
  `id`             char(36)   NOT NULL DEFAULT uuid(),
  `tramite_id`     char(36)   NOT NULL,
  `ciudadano_id`   char(36)   NOT NULL,
  `calificacion`   tinyint(4) NOT NULL COMMENT '1=muy malo … 5=excelente',
  `comentario`     text       DEFAULT NULL,
  `fecha_feedback` timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_feedback_tramite` (`tramite_id`, `ciudadano_id`),
  KEY `fk_feedback_ciudadano` (`ciudadano_id`),
  CONSTRAINT `fk_feedback_tramite`   FOREIGN KEY (`tramite_id`)   REFERENCES `tramite`  (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_feedback_ciudadano` FOREIGN KEY (`ciudadano_id`) REFERENCES `ciudadano`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PARTE 2 — DATA (catálogos → maestros → transaccional)
-- ============================================================

-- Catálogos
INSERT IGNORE INTO `estado_tramite` (`id`, `codigo`, `descripcion`) VALUES
(1, 'recibido',             'Trámite recibido, pendiente de revisión'),
(2, 'en_revision',          'En revisión por el área responsable'),
(3, 'pendiente_documentos', 'Esperando documentos adicionales del ciudadano'),
(4, 'en_proceso',           'En proceso de resolución'),
(5, 'aprobado',             'Trámite aprobado'),
(6, 'observado',            'Trámite observado, requiere corrección'),
(7, 'rechazado',            'Trámite rechazado'),
(8, 'cerrado',              'Trámite cerrado definitivamente');

INSERT IGNORE INTO `prioridad_ml` (`id`, `codigo`, `descripcion`, `nivel`) VALUES
(1, 'bajo',    'Prioridad baja',    1),
(2, 'medio',   'Prioridad media',   2),
(3, 'alto',    'Prioridad alta',    3),
(4, 'critico', 'Prioridad critica', 4);

INSERT IGNORE INTO `canal_notificacion` (`id`, `codigo`) VALUES
(1,'email'),(2,'sms'),(3,'app'),(4,'whatsapp');

INSERT IGNORE INTO `estado_notificacion` (`id`, `codigo`) VALUES
(1,'pendiente'),(2,'enviado'),(3,'fallido'),(4,'leido');

INSERT IGNORE INTO `tipo_documento` (`id`, `codigo`, `descripcion`) VALUES
(1,'dni',               'Documento Nacional de Identidad'),
(2,'partida_nacimiento','Partida de nacimiento'),
(3,'plano',             'Plano arquitectónico o catastral'),
(4,'recibo',            'Recibo de pago'),
(5,'poder_notarial',    'Poder notarial'),
(6,'otro',              'Otro tipo de documento');

-- area_municipal (UUIDs fijos y consistentes)
INSERT IGNORE INTO `area_municipal` (`id`, `nombre`, `responsable`, `email_contacto`, `telefono`) VALUES
('aa000001-0000-0000-0000-000000000001', 'Mesa de Partes General',            'Lic. Marta Rivas',      'mesadepartes@muniyauyos.gob.pe',  '01-4001001'),
('aa000001-0000-0000-0000-000000000002', 'Defensa Civil y Gestion del Riesgo','Ing. Carlos Alcantara', 'defensacivil@muniyauyos.gob.pe',  '01-4001002'),
('aa000001-0000-0000-0000-000000000003', 'Obras Publicas y Urbanismo',         'Arq. Sergio Toledo',    'obras@muniyauyos.gob.pe',         '01-4001003'),
('aa000001-0000-0000-0000-000000000004', 'Licencias y Autorizaciones',         'Lic. Rosa Campos',      'licencias@muniyauyos.gob.pe',     '01-4001004'),
('aa000001-0000-0000-0000-000000000005', 'Fiscalizacion',                      'Abg. Luis Paredes',     'fiscalizacion@muniyauyos.gob.pe', '01-4001005'),
('aa000001-0000-0000-0000-000000000006', 'Sistemas e Informatica',             'Ing. Laura Vega',       'sistemas@muniyauyos.gob.pe',      '01-4001006');

-- usuario_municipalidad
INSERT IGNORE INTO `usuario_municipalidad` (`id`, `area_id`, `nombre`, `email`, `password_hash`, `rol`) VALUES
('uu000001-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000001', 'Marta Rivas',     'mrivas@muniyauyos.gob.pe',    '$2b$12$hash_admin_001', 'admin'),
('uu000001-0000-0000-0000-000000000002', 'aa000001-0000-0000-0000-000000000002', 'Carlos Alcantara','calcantara@muniyauyos.gob.pe', '$2b$12$hash_sup_002',   'supervisor'),
('uu000001-0000-0000-0000-000000000003', 'aa000001-0000-0000-0000-000000000003', 'Sergio Toledo',   'stoledo@muniyauyos.gob.pe',    '$2b$12$hash_op_003',    'operador'),
('uu000001-0000-0000-0000-000000000004', 'aa000001-0000-0000-0000-000000000004', 'Rosa Campos',     'rcampos@muniyauyos.gob.pe',    '$2b$12$hash_op_004',    'operador'),
('uu000001-0000-0000-0000-000000000005', 'aa000001-0000-0000-0000-000000000005', 'Luis Paredes',    'lparedes@muniyauyos.gob.pe',   '$2b$12$hash_op_005',    'operador'),
('uu000001-0000-0000-0000-000000000006', 'aa000001-0000-0000-0000-000000000006', 'Laura Vega',      'lvega@muniyauyos.gob.pe',      '$2b$12$hash_ml_006',    'ml_engineer');

-- ciudadano
INSERT IGNORE INTO `ciudadano` (`id`, `dni`, `nombres`, `apellidos`, `email`, `telefono`, `direccion`, `fecha_nacimiento`) VALUES
('cc000001-0000-0000-0000-000000000001', '12345601', 'Juan',     'Garcia Lopez',    'juan.garcia@email.com',    '987001001', 'Av. Los Pinos 101',     '1980-03-15'),
('cc000001-0000-0000-0000-000000000002', '12345602', 'Maria',    'Flores Ruiz',     'maria.flores@email.com',   '987001002', 'Jr. Las Rosas 202',     '1992-07-22'),
('cc000001-0000-0000-0000-000000000003', '12345603', 'Roberto',  'Castro Diaz',     'roberto.castro@email.com', '987001003', 'Calle Libertad 303',    '1975-11-08'),
('cc000001-0000-0000-0000-000000000004', '12345604', 'Sandra',   'Morales Vega',    'sandra.morales@email.com', '987001004', 'Av. Principal 404',     '1988-05-30'),
('cc000001-0000-0000-0000-000000000005', '12345605', 'Luis',     'Herrera Paredes', 'luis.herrera@email.com',   '987001005', 'Jr. Bolivar 505',       '1965-09-12'),
('cc000001-0000-0000-0000-000000000006', '12345606', 'Carmen',   'Navarro Silva',   'carmen.navarro@email.com', '987001006', 'Calle Comercio 606',    '1995-01-25'),
('cc000001-0000-0000-0000-000000000007', '12345607', 'Miguel',   'Reyes Huaman',    'miguel.reyes@email.com',   '987001007', 'Av. San Martin 707',    '1983-06-18'),
('cc000001-0000-0000-0000-000000000008', '12345608', 'Patricia', 'Sanchez Rios',    'patricia.sanchez@email.com','987001008','Jr. Independencia 808', '1970-12-03');

-- tipo_tramite
INSERT IGNORE INTO `tipo_tramite` (`id`, `nombre`, `categoria`, `descripcion`, `dias_plazo`, `requiere_documentos`) VALUES
('tt000001-0000-0000-0000-000000000001', 'Intervencion por Emergencia y Desastres', 'solicitud',   'Atencion inmediata ante desastres naturales o colapso estructural', 2,  0),
('tt000001-0000-0000-0000-000000000002', 'Licencia de Funcionamiento Comercial',    'licencia',    'Evaluacion tecnica para apertura de establecimiento comercial',     15, 1),
('tt000001-0000-0000-0000-000000000003', 'Certificado de Inspeccion Tecnica (ITSE)','certificado', 'Validacion de condiciones de seguridad del inmueble',              7,  1),
('tt000001-0000-0000-0000-000000000004', 'Copia Certificada de Plano Catastral',    'solicitud',   'Emision de copia certificada de plano de predio urbano',           5,  0),
('tt000001-0000-0000-0000-000000000005', 'Permiso de Construccion',                 'permiso',     'Autorizacion para ejecutar obras de construccion o ampliacion',    20, 1),
('tt000001-0000-0000-0000-000000000006', 'Denuncia Sanitaria',                      'denuncia',    'Reporte de condiciones insalubres en establecimientos',            7,  0);

-- tramite
INSERT IGNORE INTO `tramite` (`id`, `ciudadano_id`, `tipo_tramite_id`, `area_id`, `numero_expediente`, `estado_id`, `prioridad_ml_id`, `score_urgencia`, `descripcion`, `fecha_ingreso`, `fecha_limite`, `usuario_asignado_id`) VALUES
('tr000001-0000-0000-0000-000000000001', 'cc000001-0000-0000-0000-000000000001', 'tt000001-0000-0000-0000-000000000004', 'aa000001-0000-0000-0000-000000000001', 'YAU-2026-000001', 1, 1, 0.1200, 'Solicito copia certificada del plano catastral del sector urbano San Antonio.',           '2026-05-01 08:30:00', '2026-05-06', 'uu000001-0000-0000-0000-000000000001'),
('tr000001-0000-0000-0000-000000000002', 'cc000001-0000-0000-0000-000000000002', 'tt000001-0000-0000-0000-000000000002', 'aa000001-0000-0000-0000-000000000004', 'YAU-2026-000002', 2, 2, 0.4500, 'Solicito licencia de funcionamiento para bodega de abarrotes en Jr. Las Rosas 202.',      '2026-05-02 09:00:00', '2026-05-17', 'uu000001-0000-0000-0000-000000000004'),
('tr000001-0000-0000-0000-000000000003', 'cc000001-0000-0000-0000-000000000003', 'tt000001-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000002', 'YAU-2026-000003', 4, 4, 0.9700, 'Denuncia urgente por derrumbe de muro en zona escolar con ninos en riesgo inminente.',    '2026-05-03 07:15:00', '2026-05-05', 'uu000001-0000-0000-0000-000000000002'),
('tr000001-0000-0000-0000-000000000004', 'cc000001-0000-0000-0000-000000000004', 'tt000001-0000-0000-0000-000000000005', 'aa000001-0000-0000-0000-000000000003', 'YAU-2026-000004', 2, 3, 0.7800, 'Solicito permiso de construccion para ampliacion de vivienda en segundo piso.',           '2026-05-05 10:00:00', '2026-05-25', 'uu000001-0000-0000-0000-000000000003'),
('tr000001-0000-0000-0000-000000000005', 'cc000001-0000-0000-0000-000000000005', 'tt000001-0000-0000-0000-000000000003', 'aa000001-0000-0000-0000-000000000001', 'YAU-2026-000005', 5, 1, 0.0900, 'Requiero constancia de posesion para instalacion de servicio de agua potable.',           '2026-04-20 11:30:00', '2026-04-27', 'uu000001-0000-0000-0000-000000000001'),
('tr000001-0000-0000-0000-000000000006', 'cc000001-0000-0000-0000-000000000006', 'tt000001-0000-0000-0000-000000000006', 'aa000001-0000-0000-0000-000000000005', 'YAU-2026-000006', 4, 3, 0.8100, 'Denuncia contra panaderia por almacenar insumos vencidos con presencia de plagas.',       '2026-05-06 08:00:00', '2026-05-13', 'uu000001-0000-0000-0000-000000000005'),
('tr000001-0000-0000-0000-000000000007', 'cc000001-0000-0000-0000-000000000007', 'tt000001-0000-0000-0000-000000000002', 'aa000001-0000-0000-0000-000000000004', 'YAU-2026-000007', 6, 2, 0.5200, 'Licencia de funcionamiento para taller mecanico con area de 80 m2.',                     '2026-05-07 09:45:00', '2026-05-22', 'uu000001-0000-0000-0000-000000000004'),
('tr000001-0000-0000-0000-000000000008', 'cc000001-0000-0000-0000-000000000008', 'tt000001-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000002', 'YAU-2026-000008', 4, 4, 0.9900, 'Edificio de 4 pisos con grietas severas en columnas, riesgo de colapso inminente.',      '2026-05-08 06:30:00', '2026-05-10', 'uu000001-0000-0000-0000-000000000002');

-- documento
INSERT IGNORE INTO `documento` (`id`, `tramite_id`, `tipo_documento_id`, `nombre_archivo`, `ruta_almacenamiento`, `tamano_bytes`, `validado_ocr`, `confianza_ocr`, `texto_extraido`) VALUES
('dd000001-0000-0000-0000-000000000001', 'tr000001-0000-0000-0000-000000000001', 1, 'dni_juan_garcia.pdf',       '/docs/2026/05/dni_juan_garcia.pdf',       204800, 1, 0.9850, 'Juan Garcia Lopez DNI 12345601'),
('dd000001-0000-0000-0000-000000000002', 'tr000001-0000-0000-0000-000000000002', 1, 'dni_maria_flores.pdf',      '/docs/2026/05/dni_maria_flores.pdf',       198400, 1, 0.9780, 'Maria Flores Ruiz DNI 12345602'),
('dd000001-0000-0000-0000-000000000003', 'tr000001-0000-0000-0000-000000000002', 4, 'recibo_pago_lic_002.pdf',   '/docs/2026/05/recibo_pago_lic_002.pdf',    102400, 1, 0.9910, 'Recibo de pago S/. 150.00 licencia funcionamiento'),
('dd000001-0000-0000-0000-000000000004', 'tr000001-0000-0000-0000-000000000003', 6, 'foto_muro_derrumbe.pdf',    '/docs/2026/05/foto_muro_derrumbe.pdf',     512000, 1, 0.8700, 'Evidencia fotografica muro colapsado zona escolar'),
('dd000001-0000-0000-0000-000000000005', 'tr000001-0000-0000-0000-000000000004', 3, 'plano_ampliacion_004.pdf',  '/docs/2026/05/plano_ampliacion_004.pdf',   768000, 1, 0.9650, 'Plano de ampliacion segundo piso vivienda unifamiliar'),
('dd000001-0000-0000-0000-000000000006', 'tr000001-0000-0000-0000-000000000006', 6, 'evidencia_plagas_006.pdf',  '/docs/2026/05/evidencia_plagas_006.pdf',   430080, 0, NULL,   NULL),
('dd000001-0000-0000-0000-000000000007', 'tr000001-0000-0000-0000-000000000007', 3, 'plano_taller_007.pdf',      '/docs/2026/05/plano_taller_007.pdf',       350000, 1, 0.9400, 'Plano distribucion taller mecanico 80 m2'),
('dd000001-0000-0000-0000-000000000008', 'tr000001-0000-0000-0000-000000000008', 6, 'foto_grietas_008.pdf',      '/docs/2026/05/foto_grietas_008.pdf',       655360, 1, 0.9200, 'Grietas estructurales columnas edificio 4 pisos');

-- historial_estado
INSERT IGNORE INTO `historial_estado` (`id`, `tramite_id`, `estado_anterior_id`, `estado_nuevo_id`, `comentario`, `usuario_id`, `fecha_cambio`) VALUES
('hh000001-0000-0000-0000-000000000001', 'tr000001-0000-0000-0000-000000000001', NULL, 1, 'Tramite registrado en sistema.',                              'uu000001-0000-0000-0000-000000000001', '2026-05-01 08:30:00'),
('hh000001-0000-0000-0000-000000000002', 'tr000001-0000-0000-0000-000000000002', NULL, 1, 'Tramite registrado en sistema.',                              'uu000001-0000-0000-0000-000000000001', '2026-05-02 09:00:00'),
('hh000001-0000-0000-0000-000000000003', 'tr000001-0000-0000-0000-000000000002',    1, 2, 'Documentacion recibida, pasa a revision.',                    'uu000001-0000-0000-0000-000000000004', '2026-05-03 10:00:00'),
('hh000001-0000-0000-0000-000000000004', 'tr000001-0000-0000-0000-000000000003', NULL, 1, 'Denuncia registrada con caracter urgente.',                   'uu000001-0000-0000-0000-000000000001', '2026-05-03 07:15:00'),
('hh000001-0000-0000-0000-000000000005', 'tr000001-0000-0000-0000-000000000003',    1, 4, 'Asignado a Defensa Civil por riesgo critico.',                'uu000001-0000-0000-0000-000000000002', '2026-05-03 08:00:00'),
('hh000001-0000-0000-0000-000000000006', 'tr000001-0000-0000-0000-000000000005',    4, 5, 'Tramite aprobado, constancia emitida.',                       'uu000001-0000-0000-0000-000000000001', '2026-04-29 14:00:00'),
('hh000001-0000-0000-0000-000000000007', 'tr000001-0000-0000-0000-000000000007',    1, 2, 'En revision, se solicito plano de distribucion del taller.',  'uu000001-0000-0000-0000-000000000004', '2026-05-08 09:00:00'),
('hh000001-0000-0000-0000-000000000008', 'tr000001-0000-0000-0000-000000000007',    2, 6, 'Observado: area declarada no coincide con plano presentado.', 'uu000001-0000-0000-0000-000000000004', '2026-05-09 11:30:00');

-- prediccion_ml
INSERT IGNORE INTO `prediccion_ml` (`id`, `tramite_id`, `modelo_usado`, `version_modelo`, `score_prioridad`, `tiempo_estimado_hrs`, `prioridad_ml_id`, `features_json`) VALUES
('pp000001-0000-0000-0000-000000000001', 'tr000001-0000-0000-0000-000000000001', 'KerasDense_TfIdf', 'v1.0', 0.1200,  8.00, 1, '{"tokens":18,"ngrams_top":["plano catastral","copia certificada"]}'),
('pp000001-0000-0000-0000-000000000002', 'tr000001-0000-0000-0000-000000000002', 'KerasDense_TfIdf', 'v1.0', 0.4500, 24.00, 2, '{"tokens":16,"ngrams_top":["licencia funcionamiento","bodega abarrotes"]}'),
('pp000001-0000-0000-0000-000000000003', 'tr000001-0000-0000-0000-000000000003', 'KerasDense_TfIdf', 'v1.0', 0.9700,  2.00, 4, '{"tokens":15,"ngrams_top":["zona escolar","riesgo inminente","derrumbe"]}'),
('pp000001-0000-0000-0000-000000000004', 'tr000001-0000-0000-0000-000000000004', 'KerasDense_TfIdf', 'v1.0', 0.7800, 48.00, 3, '{"tokens":14,"ngrams_top":["permiso construccion","ampliacion vivienda"]}'),
('pp000001-0000-0000-0000-000000000005', 'tr000001-0000-0000-0000-000000000005', 'KerasDense_TfIdf', 'v1.0', 0.0900,  6.00, 1, '{"tokens":13,"ngrams_top":["constancia posesion","agua potable"]}'),
('pp000001-0000-0000-0000-000000000006', 'tr000001-0000-0000-0000-000000000006', 'KerasDense_TfIdf', 'v1.0', 0.8100, 12.00, 3, '{"tokens":17,"ngrams_top":["insumos vencidos","presencia plagas"]}'),
('pp000001-0000-0000-0000-000000000007', 'tr000001-0000-0000-0000-000000000007', 'KerasDense_TfIdf', 'v1.0', 0.5200, 36.00, 2, '{"tokens":12,"ngrams_top":["taller mecanico","licencia funcionamiento"]}'),
('pp000001-0000-0000-0000-000000000008', 'tr000001-0000-0000-0000-000000000008', 'KerasDense_TfIdf', 'v1.0', 0.9900,  1.50, 4, '{"tokens":14,"ngrams_top":["grietas columnas","riesgo colapso","inminente"]}');

-- notificacion
INSERT IGNORE INTO `notificacion` (`id`, `tramite_id`, `ciudadano_id`, `canal_id`, `estado_notificacion_id`, `asunto`, `mensaje`, `intentos`, `fecha_envio`) VALUES
('nn000001-0000-0000-0000-000000000001', 'tr000001-0000-0000-0000-000000000001', 'cc000001-0000-0000-0000-000000000001', 1, 2, 'Tramite YAU-2026-000001 recibido',   'Su tramite fue recibido. Plazo maximo: 5 dias habiles.',                           1, '2026-05-01 08:35:00'),
('nn000001-0000-0000-0000-000000000002', 'tr000001-0000-0000-0000-000000000002', 'cc000001-0000-0000-0000-000000000002', 1, 4, 'Tramite YAU-2026-000002 en revision','Su tramite de licencia esta siendo evaluado por el area correspondiente.',          1, '2026-05-03 10:05:00'),
('nn000001-0000-0000-0000-000000000003', 'tr000001-0000-0000-0000-000000000003', 'cc000001-0000-0000-0000-000000000003', 2, 2, 'URGENTE: Denuncia YAU-2026-000003', 'Su denuncia fue recibida. Un inspector se apersonara en breve.',                    1, '2026-05-03 07:20:00'),
('nn000001-0000-0000-0000-000000000004', 'tr000001-0000-0000-0000-000000000005', 'cc000001-0000-0000-0000-000000000005', 1, 4, 'Tramite YAU-2026-000005 aprobado',  'Su constancia fue aprobada. Puede recogerla en ventanilla.',                       1, '2026-04-29 14:05:00'),
('nn000001-0000-0000-0000-000000000005', 'tr000001-0000-0000-0000-000000000007', 'cc000001-0000-0000-0000-000000000007', 1, 2, 'Tramite YAU-2026-000007 observado', 'Su tramite fue observado. Area declarada no coincide con plano. Adjunte correccion.',1, '2026-05-09 11:35:00'),
('nn000001-0000-0000-0000-000000000006', 'tr000001-0000-0000-0000-000000000008', 'cc000001-0000-0000-0000-000000000008', 2, 2, 'CRITICO: Denuncia YAU-2026-000008','Denuncia critica recibida. Equipo de inspeccion en camino. Desaloje el inmueble.',  1, '2026-05-08 06:35:00');

-- feedback_ciudadano
INSERT IGNORE INTO `feedback_ciudadano` (`id`, `tramite_id`, `ciudadano_id`, `calificacion`, `comentario`) VALUES
('ff000001-0000-0000-0000-000000000001', 'tr000001-0000-0000-0000-000000000005', 'cc000001-0000-0000-0000-000000000005', 5, 'Excelente atencion, tramite resuelto antes del plazo.'),
('ff000001-0000-0000-0000-000000000002', 'tr000001-0000-0000-0000-000000000002', 'cc000001-0000-0000-0000-000000000002', 3, 'El proceso fue lento pero el personal fue amable.'),
('ff000001-0000-0000-0000-000000000003', 'tr000001-0000-0000-0000-000000000003', 'cc000001-0000-0000-0000-000000000003', 4, 'Respondieron rapido a la denuncia, gracias.'),
('ff000001-0000-0000-0000-000000000004', 'tr000001-0000-0000-0000-000000000007', 'cc000001-0000-0000-0000-000000000007', 2, 'Tuve que volver dos veces por documentacion incompleta.');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;