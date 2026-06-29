-- ------------------------------------------------------------
-- departamento
-- ------------------------------------------------------------
INSERT INTO departamento (nombre) VALUES
  ('Montevideo'),
  ('Canelones'),
  ('Maldonado'),
  ('Salto'),
  ('Paysandú'),
  ('Rivera'),
  ('Colonia'),
  ('San José'),
  ('Flores'),
  ('Florida');

-- ------------------------------------------------------------
-- zona
-- ------------------------------------------------------------
INSERT INTO zona (nombre, id_departamento) VALUES
  ('Zona Centro',          1),  -- Montevideo
  ('Zona Oeste',           1),
  ('Zona Norte',           1),
  ('Ciudad de la Costa',   2),  -- Canelones
  ('Las Piedras',          2),
  ('Punta del Este',       3),  -- Maldonado
  ('San Carlos',           3),
  ('Ciudad de Salto',      4),  -- Salto
  ('Ciudad de Paysandú',   5),  -- Paysandú
  ('Rivera Centro',        6);  -- Rivera

-- ------------------------------------------------------------
-- establecimiento
-- ------------------------------------------------------------
INSERT INTO establecimiento (nombre, tipo, id_zona) VALUES
  ('Escuela N° 123 – Palermo',            'Escuela',      1),
  ('Liceo N° 5 – Montevideo',             'Liceo',        1),
  ('Universidad de la República – FHCE',  'Universidad',  3),
  ('Escuela N° 45 – Ciudad de la Costa',  'Escuela',      4),
  ('Liceo N° 3 – Las Piedras',            'Liceo',        5),
  ('Escuela N° 12 – Punta del Este',      'Escuela',      6),
  ('Liceo N° 1 – Salto',                  'Liceo',        8),
  ('Escuela N° 9 – Paysandú',             'Escuela',      9),
  ('Centro Comunal Zona Oeste',           'Otro',         2),
  ('Escuela N° 7 – Rivera',               'Escuela',      10);

-- ------------------------------------------------------------
-- circuito
-- ------------------------------------------------------------
INSERT INTO circuito (numero, id_establecimiento, id_departamento, localidad, barrio_zona, es_accesible) VALUES
  ('0101', 1, 1, 'Montevideo',        'Palermo',           TRUE),
  ('0102', 1, 1, 'Montevideo',        'Palermo',           TRUE),
  ('0201', 2, 1, 'Montevideo',        'Centro',            FALSE),
  ('0301', 3, 1, 'Montevideo',        'Parque Batlle',     TRUE),
  ('0401', 4, 2, 'Ciudad de la Costa','Solymar',           TRUE),
  ('0402', 4, 2, 'Ciudad de la Costa','Lagomar',           FALSE),
  ('0501', 5, 2, 'Las Piedras',       NULL,                FALSE),
  ('0601', 6, 3, 'Punta del Este',    'Península',         TRUE),
  ('0701', 7, 4, 'Salto',             NULL,                TRUE),
  ('0801', 8, 5, 'Paysandú',          'Zona Norte',        FALSE),
  ('0901', 9, 1, 'Montevideo',        'Zona Oeste',        TRUE),
  ('1001', 10,6, 'Rivera',            NULL,                FALSE);

-- ------------------------------------------------------------
-- ciudadano  (cédula 8 dígitos, credencial 10 chars)
-- ------------------------------------------------------------
INSERT INTO ciudadano (cedula_identidad, credencial_civica, nombre_completo, fecha_nacimiento) VALUES
  -- Miembros de mesa
  ('12345678', 'ABA1234567', 'Ana García Pérez',         '1975-03-12'),
  ('23456789', 'ABB2345678', 'Carlos Rodríguez Silva',   '1968-07-24'),
  ('34567890', 'ABC3456789', 'María López Torres',        '1980-11-05'),
  ('45678901', 'ABD4567890', 'Roberto Martínez Díaz',    '1972-01-30'),
  ('56789012', 'ABE5678901', 'Laura Fernández Costa',    '1985-09-18'),
  ('67890123', 'ABF6789012', 'Diego Suárez Morales',     '1978-04-22'),
  ('78901234', 'ABG7890123', 'Patricia Álvarez Reyes',   '1990-06-10'),
  ('89012345', 'ABH8901234', 'Fernando Gómez Ruiz',      '1965-12-03'),
  ('90123456', 'ABI9012345', 'Claudia Núñez Castro',     '1982-08-17'),
  ('01234567', 'ABJ0123456', 'Andrés Pereyra Lima',      '1977-02-28'),
  -- Candidatos / ciudadanos generales
  ('11111111', 'ACK1111111', 'Juan Pedro Sánchez Vidal', '1962-05-15'),
  ('22222222', 'ACL2222222', 'Elena Ibáñez Pronto',      '1970-09-01'),
  ('33333333', 'ACM3333333', 'Marcos Pereira Dos Santos','1955-11-20'),
  ('44444444', 'ACN4444444', 'Sofía Cabrera Méndez',     '1988-03-08'),
  ('55555555', 'ACO5555555', 'Pablo Herrera Vaz',        '1973-07-14'),
  ('66666666', 'ACP6666666', 'Valentina Ríos Ugarte',    '1991-01-25'),
  ('77777777', 'ACQ7777777', 'Nicolás Estrada Fuentes',  '1968-10-30'),
  ('88888888', 'ACR8888888', 'Beatriz Acosta Ponce',     '1960-04-12'),
  ('99999999', 'ACS9999999', 'Jorge Gianotti Mazzini',   '1950-06-06'),
  ('10101010', 'ACT1010101', 'Lucía Ramírez Da Silva',   '1994-12-19'),
  -- Agentes policiales
  ('11223344', 'AGA1122334', 'Gustavo Peña Silveira',    '1980-05-05'),
  ('22334455', 'AGB2233445', 'Andrea Flores Medina',     '1985-08-22'),
  ('33445566', 'AGC3344556', 'Rodrigo Bentín Olmos',     '1978-03-14'),
  ('44556677', 'AGD4455667', 'Natalia Cardozo Leal',     '1990-11-11'),
  -- Autoridades de partidos
  ('55667788', 'APA5566778', 'Ernesto Villagrán Ponce',  '1958-07-19'),
  ('66778899', 'APB6677889', 'Carmen Soto Figueroa',     '1963-02-28'),
  ('77889900', 'APC7788990', 'Héctor Leiva Caraballo',   '1955-09-03'),
  ('88990011', 'APD8899001', 'Rosa Fernández Motta',     '1967-04-16'),
  -- Votantes adicionales
  ('12121212', 'AVO1212121', 'Tomás Berro Pacheco',      '1995-06-30'),
  ('21212121', 'AVO2121212', 'Inés Blanco Piñeiro',      '1998-11-15');

-- ------------------------------------------------------------
-- comisaria
-- ------------------------------------------------------------
INSERT INTO comisaria (nombre, id_departamento) VALUES
  ('Comisaría Seccional 1ª – Montevideo',  1),
  ('Comisaría Seccional 5ª – Montevideo',  1),
  ('Comisaría Canelones Centro',           2),
  ('Comisaría Maldonado',                  3),
  ('Comisaría Salto',                      4),
  ('Comisaría Paysandú',                   5);

-- ------------------------------------------------------------
-- agente_policial
-- ------------------------------------------------------------
INSERT INTO agente_policial (cedula_identidad, id_comisaria) VALUES
  ('11223344', 1),
  ('22334455', 1),
  ('33445566', 3),
  ('44556677', 4);

-- ------------------------------------------------------------
-- organismo_estado
-- ------------------------------------------------------------
INSERT INTO organismo_estado (nombre) VALUES
  ('Corte Electoral'),
  ('Ministerio del Interior'),
  ('Intendencia de Montevideo'),
  ('Intendencia de Canelones'),
  ('Oficina Nacional del Servicio Civil');

-- ------------------------------------------------------------
-- miembro_mesa  (10 personas para integrar las mesas)
-- ------------------------------------------------------------
INSERT INTO miembro_mesa (cedula_identidad, id_organismo) VALUES
  ('12345678', 1),
  ('23456789', 1),
  ('34567890', 1),
  ('45678901', 1),
  ('56789012', 1),
  ('67890123', 1),
  ('78901234', 1),
  ('89012345', 1),
  ('90123456', 1),
  ('01234567', 1);

-- ------------------------------------------------------------
-- tipo_eleccion
-- ------------------------------------------------------------
INSERT INTO tipo_eleccion (nombre) VALUES
  ('Interna'),
  ('Presidencial'),
  ('Ballotage'),
  ('Municipal'),
  ('Plebiscito'),
  ('Referendum');

-- ------------------------------------------------------------
-- eleccion
-- ------------------------------------------------------------
INSERT INTO eleccion (fecha, id_tipo, descripcion) VALUES
  ('2024-06-30', 1, 'Elecciones internas 2024 – selección de candidatos'),
  ('2024-10-27', 2, 'Elecciones nacionales 2024 – primera vuelta'),
  ('2024-11-24', 3, 'Balotaje 2024 – segunda vuelta presidencial'),
  ('2025-05-11', 4, 'Elecciones municipales 2025 – intendentes y juntas');

-- ------------------------------------------------------------
-- mesa  (3 por elección, usando 9 miembros distintos por grupos)
-- ------------------------------------------------------------
-- Elección 1 – Interna
INSERT INTO mesa (id_circuito, id_eleccion, ci_presidente, ci_secretario, ci_vocal) VALUES
  (1,  1, '12345678', '23456789', '34567890'),
  (4,  1, '45678901', '56789012', '67890123'),
  (7,  1, '78901234', '89012345', '90123456');

-- Elección 2 – Presidencial
INSERT INTO mesa (id_circuito, id_eleccion, ci_presidente, ci_secretario, ci_vocal) VALUES
  (1,  2, '12345678', '23456789', '34567890'),
  (2,  2, '45678901', '56789012', '67890123'),
  (3,  2, '78901234', '89012345', '90123456'),
  (4,  2, '01234567', '12345678', '23456789'),
  (6,  2, '34567890', '45678901', '56789012');

-- Elección 3 – Ballotage
INSERT INTO mesa (id_circuito, id_eleccion, ci_presidente, ci_secretario, ci_vocal) VALUES
  (1,  3, '12345678', '23456789', '34567890'),
  (2,  3, '45678901', '56789012', '67890123'),
  (5,  3, '78901234', '89012345', '90123456');

-- Elección 4 – Municipal
INSERT INTO mesa (id_circuito, id_eleccion, ci_presidente, ci_secretario, ci_vocal) VALUES
  (1,  4, '12345678', '23456789', '34567890'),
  (3,  4, '45678901', '56789012', '67890123'),
  (4,  4, '78901234', '89012345', '90123456'),
  (8,  4, '01234567', '12345678', '23456789');

-- ------------------------------------------------------------
-- Para cerrar una mesa y cambiar su estado
--  UPDATE mesa
-- SET estado = 'Cerrada',
--    fecha_hora_cierre = NOW()
-- WHERE id_mesa = 1
--  AND estado = 'Abierta';
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- asignacion_policial
-- ------------------------------------------------------------
INSERT INTO asignacion_policial (cedula_agente, id_establecimiento, id_eleccion) VALUES
  ('11223344', 1, 1),
  ('22334455', 2, 1),
  ('33445566', 4, 1),
  ('44556677', 6, 1),
  ('11223344', 1, 2),
  ('22334455', 2, 2),
  ('33445566', 4, 2),
  ('44556677', 5, 2),
  ('11223344', 1, 3),
  ('22334455', 2, 3),
  ('11223344', 1, 4),
  ('33445566', 4, 4),
  ('22334455', 5, 4),
  ('44556677', 6, 4);

-- ------------------------------------------------------------
-- partido_politico
-- ------------------------------------------------------------
INSERT INTO partido_politico (nombre, direccion_sede) VALUES
  ('Frente Amplio',              'Colonia 1921, Montevideo'),
  ('Partido Nacional',           'Andes 1365, Montevideo'),
  ('Partido Colorado',           'Andrés Martínez Trueba 1271, Montevideo'),
  ('Cabildo Abierto',            'Ciudadela 1435, Montevideo'),
  ('Partido Independiente',      'Río Branco 1480, Montevideo');

-- ------------------------------------------------------------
-- autoridad_partido
-- ------------------------------------------------------------
INSERT INTO autoridad_partido (id_partido, cedula_identidad, rol) VALUES
  (1, '11111111', 'Presidente'),
  (1, '22222222', 'Vicepresidente'),
  (2, '33333333', 'Presidente'),
  (2, '44444444', 'Vicepresidente'),
  (3, '55555555', 'Presidente'),
  (3, '66666666', 'Vicepresidente'),
  (4, '77777777', 'Presidente'),
  (4, '88888888', 'Vicepresidente'),
  (5, '99999999', 'Presidente'),
  (5, '10101010', 'Vicepresidente');

-- ------------------------------------------------------------
-- papeleta
-- Elección 1 (Interna): papeletas de candidatura sin lista
-- Elección 2 (Presidencial): fórmulas presidenciales
-- Elección 3 (Ballotage): las dos fórmulas que pasan
-- Elección 4 (Municipal): listas departamentales
-- ------------------------------------------------------------

-- Elección 1 – Interna (es_lista = FALSE, candidatos a presidentes de partido)
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (1, NULL, FALSE, 'Candidatura Interna FA – Lista 1001',  'Rojo',   1, NULL, NULL),
  (1, NULL, FALSE, 'Candidatura Interna PN – Lista 2001',  'Blanco', 2, NULL, NULL),
  (1, NULL, FALSE, 'Candidatura Interna PC – Lista 3001',  'Colorado', 3, NULL, NULL);

-- Elección 2 – Presidencial (fórmulas, es_lista = FALSE)
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (2, NULL, FALSE, 'Fórmula Presidencial FA 2024',    'Rojo',     1, NULL, NULL),
  (2, NULL, FALSE, 'Fórmula Presidencial PN 2024',    'Blanco',   2, NULL, NULL),
  (2, NULL, FALSE, 'Fórmula Presidencial PC 2024',    'Colorado', 3, NULL, NULL),
  (2, NULL, FALSE, 'Fórmula Presidencial CA 2024',    'Verde',    4, NULL, NULL);

-- Papeletas de listas al Senado – Elección 2
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (2, 609,  TRUE, 'Lista 609 – FA Senadores',  'Rojo',     1, 'Senadores', NULL),
  (2, 71,   TRUE, 'Lista 71 – PN Senadores',   'Blanco',   2, 'Senadores', NULL),
  (2, 15,   TRUE, 'Lista 15 – PC Senadores',   'Colorado', 3, 'Senadores', NULL);

-- Papeletas de listas a Diputados Montevideo – Elección 2
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (2, 5000, TRUE, 'Lista 5000 – FA Diputados Montevideo', 'Rojo',   1, 'Diputados', 1),
  (2, 2100, TRUE, 'Lista 2100 – PN Diputados Montevideo', 'Blanco', 2, 'Diputados', 1),
  (2, 3100, TRUE, 'Lista 3100 – PC Diputados Montevideo', 'Colorado',3,'Diputados', 1);

-- Elección 3 – Ballotage (solo fórmulas presidenciales que pasaron)
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (3, NULL, FALSE, 'Fórmula FA – Segunda Vuelta 2024',  'Rojo',   1, NULL, NULL),
  (3, NULL, FALSE, 'Fórmula PN – Segunda Vuelta 2024',  'Blanco', 2, NULL, NULL);

-- Elección 4 – Municipal: Intendente + Junta Departamental Montevideo
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (4, NULL, FALSE, 'Candidato Intendente FA – Montevideo',   'Rojo',     1, NULL,                  1),
  (4, NULL, FALSE, 'Candidato Intendente PN – Montevideo',   'Blanco',   2, NULL,                  1),
  (4, NULL, FALSE, 'Candidato Intendente PC – Montevideo',   'Colorado', 3, NULL,                  1),
  (4, 8001, TRUE,  'Lista 8001 – FA Junta Dpto. Montevideo', 'Rojo',     1, 'Junta Departamental', 1),
  (4, 8002, TRUE,  'Lista 8002 – PN Junta Dpto. Montevideo', 'Blanco',   2, 'Junta Departamental', 1);

-- Elección 4 – Concejo Municipal Canelones
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (4, 9001, TRUE, 'Lista 9001 – FA Concejo Canelones', 'Rojo',   1, 'Concejo Municipal', 2),
  (4, 9002, TRUE, 'Lista 9002 – PN Concejo Canelones', 'Blanco', 2, 'Concejo Municipal', 2);

-- ------------------------------------------------------------
-- papeleta_candidato_apoyo  (candidatos vinculados a fórmulas)
-- id_papeleta según orden de inserción:
--   1-3  → Interna (FA, PN, PC)
--   4-7  → Pres. (FA=4, PN=5, PC=6, CA=7)
--   8-10 → Senado
--   11-13→ Diputados Mvd
--   14-15→ Ballotage
--   16-20→ Intendentes + Juntas Municipal
--   21-22→ Concejo Canelones
-- ------------------------------------------------------------
INSERT INTO papeleta_candidato_apoyo (id_papeleta, cedula_candidato) VALUES
  -- Interna FA
  (1, '11111111'),
  -- Interna PN
  (2, '33333333'),
  -- Interna PC
  (3, '55555555'),
  -- Presidencial FA (fórmula: presidente + vice del partido)
  (4, '11111111'),
  (4, '22222222'),
  -- Presidencial PN
  (5, '33333333'),
  (5, '44444444'),
  -- Presidencial PC
  (6, '55555555'),
  (6, '66666666'),
  -- Presidencial CA
  (7, '77777777'),
  (7, '88888888'),
  -- Ballotage FA
  (14, '11111111'),
  (14, '22222222'),
  -- Ballotage PN
  (15, '33333333'),
  (15, '44444444'),
  -- Intendente FA Mvd
  (16, '11111111'),
  -- Intendente PN Mvd
  (17, '33333333'),
  -- Intendente PC Mvd
  (18, '55555555');

-- ------------------------------------------------------------
-- lista_integrante  (listas con orden de candidatos)
-- ------------------------------------------------------------
-- Lista 609 FA Senadores (id_papeleta = 8)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (8, '11111111', 1),
  (8, '22222222', 2),
  (8, '55555555', 3);

-- Lista 71 PN Senadores (id_papeleta = 9)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (9, '33333333', 1),
  (9, '44444444', 2),
  (9, '66666666', 3);

-- Lista 15 PC Senadores (id_papeleta = 10)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (10, '77777777', 1),
  (10, '88888888', 2);

-- Lista 5000 FA Diputados Mvd (id_papeleta = 11)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (11, '99999999', 1),
  (11, '10101010', 2);

-- Lista 2100 PN Diputados Mvd (id_papeleta = 12)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (12, '12121212', 1),
  (12, '21212121', 2);

-- Lista 3100 PC Diputados Mvd (id_papeleta = 13)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (13, '55667788', 1),
  (13, '66778899', 2);

-- Lista 8001 FA Junta Dpto. Mvd (id_papeleta = 19)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (19, '77889900', 1),
  (19, '88990011', 2);

-- Lista 8002 PN Junta Dpto. Mvd (id_papeleta = 20)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (20, '12121212', 1),
  (20, '21212121', 2);

-- Lista 9001 FA Concejo Canelones (id_papeleta = 21)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (21, '10101010', 1),
  (21, '99999999', 2);

-- Lista 9002 PN Concejo Canelones (id_papeleta = 22)
INSERT INTO lista_integrante (id_papeleta, cedula_candidato, orden) VALUES
  (22, '55667788', 1),
  (22, '66778899', 2);

-- ------------------------------------------------------------
-- circuito_credencial  (asignación de votantes a circuitos)
-- ------------------------------------------------------------
INSERT INTO circuito_credencial (id_circuito, credencial_civica) VALUES
  -- Circuito 1 (Escuela Palermo, Mvd)
  (1, 'ABA1234567'),
  (1, 'ABB2345678'),
  (1, 'ABC3456789'),
  (1, 'ACK1111111'),
  (1, 'ACL2222222'),
  -- Circuito 2
  (2, 'ABD4567890'),
  (2, 'ABE5678901'),
  (2, 'ABF6789012'),
  (2, 'ACM3333333'),
  (2, 'ACN4444444'),
  -- Circuito 3
  (3, 'ABG7890123'),
  (3, 'ABH8901234'),
  (3, 'ABI9012345'),
  (3, 'ACO5555555'),
  (3, 'ACP6666666'),
  -- Circuito 4
  (4, 'ABJ0123456'),
  (4, 'ACQ7777777'),
  (4, 'ACR8888888'),
  (4, 'ACS9999999'),
  (4, 'ACT1010101'),
  -- Circuito 5
  (5, 'AGA1122334'),
  (5, 'AGB2233445'),
  (5, 'AGC3344556'),
  -- Circuito 6
  (6, 'AGD4455667'),
  (6, 'APA5566778'),
  (6, 'APB6677889'),
  -- Circuito 7
  (7, 'APC7788990'),
  (7, 'APD8899001'),
  (7, 'AVO1212121'),
  (7, 'AVO2121212');

-- ============================================================
--  FIN DEL ARCHIVO
--  Tablas sin datos (por diseño):
--    voto
--    voto_papeleta
--    participacion_votante
-- ============================================================