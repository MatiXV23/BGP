DROP DATABASE IF EXISTS elecciones_uy;
CREATE DATABASE elecciones_uy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elecciones_uy;
CREATE TABLE departamento (
    id_departamento   INT            AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(60)    NOT NULL UNIQUE
);
CREATE TABLE zona (
    id_zona           INT            AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(100)   NOT NULL,
    id_departamento   INT            NOT NULL,
    CONSTRAINT fk_zona_dpto FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento)
);
CREATE TABLE establecimiento (
    id_establecimiento  INT           AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(150)  NOT NULL,
    tipo                ENUM('Escuela','Liceo','Universidad','Otro') NOT NULL,
    direccion           VARCHAR(200),
    id_zona             INT           NOT NULL,
    CONSTRAINT fk_estab_zona FOREIGN KEY (id_zona) REFERENCES zona(id_zona)
);
CREATE TABLE circuito (
    id_circuito         INT           AUTO_INCREMENT PRIMARY KEY,
    numero              VARCHAR(20)   NOT NULL UNIQUE,
    id_establecimiento  INT           NOT NULL,
    id_departamento     INT           NOT NULL,
    localidad           VARCHAR(100)  NOT NULL,
    barrio_zona         VARCHAR(100),
    es_accesible        TINYINT(1)    NOT NULL DEFAULT 0,
    CONSTRAINT fk_circ_estab FOREIGN KEY (id_establecimiento) REFERENCES establecimiento(id_establecimiento),
    CONSTRAINT fk_circ_dpto  FOREIGN KEY (id_departamento)   REFERENCES departamento(id_departamento)
);
CREATE TABLE ciudadano (
    cedula_identidad    CHAR(8)        PRIMARY KEY,
    credencial_civica   CHAR(10)       NOT NULL UNIQUE,
    nombre_completo     VARCHAR(150)   NOT NULL
);
CREATE TABLE votante (
    credencial_civica   CHAR(10)       PRIMARY KEY,
    cedula_identidad    CHAR(8)        NOT NULL UNIQUE,
    nombre_completo     VARCHAR(150)   NOT NULL
);
CREATE TABLE circuito_credencial (
    id_circuito         INT            NOT NULL,
    credencial_civica   CHAR(10)       NOT NULL,
    PRIMARY KEY (id_circuito, credencial_civica),
    CONSTRAINT fk_cc_circ   FOREIGN KEY (id_circuito)       REFERENCES circuito(id_circuito),
    CONSTRAINT fk_cc_votante FOREIGN KEY (credencial_civica) REFERENCES votante(credencial_civica)
);
CREATE TABLE comisaria (
    id_comisaria        INT            AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(100)   NOT NULL,
    id_departamento     INT            NOT NULL,
    CONSTRAINT fk_com_dpto FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento)
);
CREATE TABLE agente_policial (
    cedula_identidad    CHAR(8)        PRIMARY KEY,
    credencial_civica   CHAR(10)       NOT NULL UNIQUE,
    nombre_completo     VARCHAR(150)   NOT NULL,
    id_comisaria        INT            NOT NULL,
    CONSTRAINT fk_agente_com FOREIGN KEY (id_comisaria) REFERENCES comisaria(id_comisaria)
);
CREATE TABLE asignacion_policial (
    id_asignacion       INT            AUTO_INCREMENT PRIMARY KEY,
    cedula_agente       CHAR(8)        NOT NULL,
    id_establecimiento  INT            NOT NULL,
    id_eleccion         INT            NOT NULL,
    CONSTRAINT fk_asp_agente FOREIGN KEY (cedula_agente)       REFERENCES agente_policial(cedula_identidad),
    CONSTRAINT fk_asp_estab  FOREIGN KEY (id_establecimiento)  REFERENCES establecimiento(id_establecimiento)
);
CREATE TABLE organismo_estado (
    id_organismo        INT            AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(150)   NOT NULL UNIQUE
);
CREATE TABLE miembro_mesa (
    cedula_identidad    CHAR(8)        PRIMARY KEY,
    credencial_civica   CHAR(10)       NOT NULL UNIQUE,
    nombre_completo     VARCHAR(150)   NOT NULL,
    fecha_nacimiento    DATE           NOT NULL,
    id_organismo        INT            NOT NULL,
    CONSTRAINT fk_mm_org FOREIGN KEY (id_organismo) REFERENCES organismo_estado(id_organismo)
);
CREATE TABLE mesa (
    id_mesa             INT            AUTO_INCREMENT PRIMARY KEY,
    id_circuito         INT            NOT NULL,
    id_eleccion         INT            NOT NULL,
    ci_presidente       CHAR(8)        NOT NULL,
    ci_secretario       CHAR(8)        NOT NULL,
    ci_vocal            CHAR(8)        NOT NULL,
    CONSTRAINT fk_mesa_circ  FOREIGN KEY (id_circuito)    REFERENCES circuito(id_circuito),
    CONSTRAINT fk_mesa_pres  FOREIGN KEY (ci_presidente)  REFERENCES miembro_mesa(cedula_identidad),
    CONSTRAINT fk_mesa_sec   FOREIGN KEY (ci_secretario)  REFERENCES miembro_mesa(cedula_identidad),
    CONSTRAINT fk_mesa_vocal FOREIGN KEY (ci_vocal)       REFERENCES miembro_mesa(cedula_identidad),
    CONSTRAINT uq_mesa_circ_elec UNIQUE (id_circuito, id_eleccion)
);
CREATE TABLE partido_politico (
    id_partido          INT            AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(150)   NOT NULL UNIQUE,
    direccion_sede      VARCHAR(200)
);
CREATE TABLE autoridad_partido (
    id_autoridad        INT            AUTO_INCREMENT PRIMARY KEY,
    id_partido          INT            NOT NULL,
    cedula_identidad    CHAR(8)        NOT NULL,
    credencial_civica   CHAR(10)       NOT NULL,
    nombre_completo     VARCHAR(150)   NOT NULL,
    rol                 ENUM('Presidente','Vicepresidente') NOT NULL,
    CONSTRAINT fk_aut_partido FOREIGN KEY (id_partido) REFERENCES partido_politico(id_partido),
    CONSTRAINT uq_partido_rol UNIQUE (id_partido, rol)
);
CREATE TABLE candidato (
    cedula_identidad    CHAR(8)        PRIMARY KEY,
    credencial_civica   CHAR(10)       NOT NULL UNIQUE,
    nombre_completo     VARCHAR(150)   NOT NULL
);
CREATE TABLE tipo_eleccion (
    id_tipo             INT            AUTO_INCREMENT PRIMARY KEY,
    nombre              ENUM('Presidencial','Ballotage','Municipal','Plebiscito','Referendum','Interna')
                                       NOT NULL UNIQUE
);
CREATE TABLE eleccion (
    id_eleccion         INT            AUTO_INCREMENT PRIMARY KEY,
    fecha               DATE           NOT NULL,
    id_tipo             INT            NOT NULL,
    descripcion         VARCHAR(255),
    CONSTRAINT fk_elec_tipo FOREIGN KEY (id_tipo) REFERENCES tipo_eleccion(id_tipo)
);
CREATE TABLE eleccion_simultanea (
    id_eleccion_a       INT            NOT NULL,
    id_eleccion_b       INT            NOT NULL,
    PRIMARY KEY (id_eleccion_a, id_eleccion_b),
    CONSTRAINT fk_sim_a FOREIGN KEY (id_eleccion_a) REFERENCES eleccion(id_eleccion),
    CONSTRAINT fk_sim_b FOREIGN KEY (id_eleccion_b) REFERENCES eleccion(id_eleccion),
    CONSTRAINT chk_sim  CHECK (id_eleccion_a < id_eleccion_b)
);
CREATE TABLE papeleta (
    id_papeleta         INT            AUTO_INCREMENT PRIMARY KEY,
    id_eleccion         INT            NOT NULL,
    numero_lista        INT            UNIQUE,
    es_lista            TINYINT(1)     NOT NULL DEFAULT 1,
    descripcion         VARCHAR(100),
    color               VARCHAR(50),
    id_partido          INT,
    organo_candidatura  ENUM('Senadores','Diputados','Junta Departamental','Concejo Municipal') NULL,
    id_departamento     INT            NULL,
    CONSTRAINT fk_pap_elec   FOREIGN KEY (id_eleccion)      REFERENCES eleccion(id_eleccion),
    CONSTRAINT fk_pap_part   FOREIGN KEY (id_partido)        REFERENCES partido_politico(id_partido),
    CONSTRAINT fk_pap_dpto   FOREIGN KEY (id_departamento)   REFERENCES departamento(id_departamento)
);
CREATE TABLE papeleta_candidato_apoyo (
    id_papeleta         INT            NOT NULL,
    cedula_candidato    CHAR(8)        NOT NULL,
    PRIMARY KEY (id_papeleta, cedula_candidato),
    CONSTRAINT fk_pca_pap  FOREIGN KEY (id_papeleta)      REFERENCES papeleta(id_papeleta),
    CONSTRAINT fk_pca_cand FOREIGN KEY (cedula_candidato) REFERENCES candidato(cedula_identidad)
);
CREATE TABLE lista_integrante (
    id_papeleta         INT            NOT NULL,
    cedula_candidato    CHAR(8)        NOT NULL,
    orden               INT            NOT NULL,
    PRIMARY KEY (id_papeleta, cedula_candidato),
    CONSTRAINT uq_lista_orden   UNIQUE (id_papeleta, orden),
    CONSTRAINT fk_li_pap   FOREIGN KEY (id_papeleta)      REFERENCES papeleta(id_papeleta),
    CONSTRAINT fk_li_cand  FOREIGN KEY (cedula_candidato) REFERENCES candidato(cedula_identidad)
);
CREATE TABLE participacion_votante (
    id_participacion    BIGINT         AUTO_INCREMENT PRIMARY KEY,
    credencial_civica   CHAR(10)       NOT NULL,
    id_eleccion         INT            NOT NULL,
    fecha_hora          DATETIME       NOT NULL,
    es_observado        TINYINT(1)     NOT NULL DEFAULT 0,
    id_circuito_real    INT            NOT NULL,
    CONSTRAINT uq_part_vot_elec UNIQUE (credencial_civica, id_eleccion),
    CONSTRAINT fk_pv_votante FOREIGN KEY (credencial_civica)  REFERENCES votante(credencial_civica),
    CONSTRAINT fk_pv_elec    FOREIGN KEY (id_eleccion)        REFERENCES eleccion(id_eleccion),
    CONSTRAINT fk_pv_circ    FOREIGN KEY (id_circuito_real)   REFERENCES circuito(id_circuito)
);
CREATE TABLE voto (
    id_voto             BIGINT         AUTO_INCREMENT PRIMARY KEY,
    token_anonimo       CHAR(36)       NOT NULL UNIQUE,
    id_circuito         INT            NOT NULL,
    id_eleccion         INT            NOT NULL,
    fecha_hora          DATETIME       NOT NULL,
    estado              ENUM('Valido','Anulado','Blanco') NOT NULL DEFAULT 'Valido',
    es_observado        TINYINT(1)     NOT NULL DEFAULT 0,
    CONSTRAINT fk_voto_circ FOREIGN KEY (id_circuito) REFERENCES circuito(id_circuito),
    CONSTRAINT fk_voto_elec FOREIGN KEY (id_eleccion) REFERENCES eleccion(id_eleccion)
);
CREATE TABLE voto_papeleta (
    id_voto             BIGINT         NOT NULL,
    id_papeleta         INT            NOT NULL,
    PRIMARY KEY (id_voto, id_papeleta),
    CONSTRAINT fk_vp_voto FOREIGN KEY (id_voto)     REFERENCES voto(id_voto),
    CONSTRAINT fk_vp_pap  FOREIGN KEY (id_papeleta) REFERENCES papeleta(id_papeleta)
);
ALTER TABLE asignacion_policial
    ADD CONSTRAINT fk_asp_elec FOREIGN KEY (id_eleccion) REFERENCES eleccion(id_eleccion);
ALTER TABLE mesa
    ADD CONSTRAINT fk_mesa_elec FOREIGN KEY (id_eleccion) REFERENCES eleccion(id_eleccion);
CREATE INDEX idx_circuito_depto    ON circuito(id_departamento);
CREATE INDEX idx_voto_circuito     ON voto(id_circuito);
CREATE INDEX idx_voto_eleccion     ON voto(id_eleccion);
CREATE INDEX idx_part_eleccion     ON participacion_votante(id_eleccion);
CREATE INDEX idx_papeleta_eleccion ON papeleta(id_eleccion);
CREATE INDEX idx_papeleta_partido  ON papeleta(id_partido);
CREATE INDEX idx_lista_candidato   ON lista_integrante(cedula_candidato);
CREATE VIEW v_resultados_eleccion AS
SELECT
    e.id_eleccion,
    e.fecha,
    te.nombre                          AS tipo_eleccion,
    p.id_papeleta,
    p.numero_lista,
    p.descripcion                      AS papeleta,
    pp.nombre                          AS partido,
    COUNT(vp.id_voto)                  AS votos_obtenidos
FROM eleccion        e
JOIN tipo_eleccion   te ON te.id_tipo      = e.id_tipo
JOIN papeleta        p  ON p.id_eleccion   = e.id_eleccion
LEFT JOIN partido_politico pp ON pp.id_partido = p.id_partido
LEFT JOIN voto_papeleta vp    ON vp.id_papeleta = p.id_papeleta
LEFT JOIN voto          v     ON v.id_voto      = vp.id_voto
                              AND v.estado = 'Valido'
GROUP BY e.id_eleccion, p.id_papeleta;
CREATE VIEW v_participacion_circuito AS
SELECT
    c.id_circuito,
    c.numero,
    c.localidad,
    e.id_eleccion,
    e.fecha,
    COUNT(pv.id_participacion) AS total_votantes
FROM circuito              c
JOIN participacion_votante pv ON pv.id_circuito_real = c.id_circuito
JOIN eleccion              e  ON e.id_eleccion        = pv.id_eleccion
GROUP BY c.id_circuito, e.id_eleccion;