-- ============================================================
--  Datos extra para poblar las 4 vistas usadas por /reportes:
--    v_resultados_eleccion, v_votos_por_departamento,
--    v_votos_por_partido, v_votos_por_candidato
--
--  01_inserts.sql solo carga votos para la elección 4 (Municipal)
--  en los circuitos 1 y 8, por lo que las elecciones 1-3 y el resto
--  de los departamentos aparecían siempre en 0. Este archivo agrega
--  voto/voto_papeleta (y, para el Partido Independiente, una
--  papeleta propia) para que las 4 vistas muestren datos variados
--  en todas las elecciones y en varios departamentos.
--
--  Los id_voto asumen que se ejecuta justo después de 01_inserts.sql
--  (últimos id usados: id_voto 8, id_papeleta 27), sobre una base
--  recién inicializada.
-- ============================================================

-- ------------------------------------------------------------
-- Elección 1 – Interna (circuitos con mesa: 1, 4, 7)
-- ------------------------------------------------------------
INSERT INTO voto (id_circuito, id_eleccion, estado, es_observado) VALUES
  (1, 1, 'Valido',  FALSE), -- id_voto 9
  (1, 1, 'Valido',  FALSE), -- id_voto 10
  (4, 1, 'Valido',  FALSE), -- id_voto 11
  (4, 1, 'Valido',  TRUE),  -- id_voto 12 (observado)
  (7, 1, 'Valido',  FALSE), -- id_voto 13
  (7, 1, 'Anulado', FALSE), -- id_voto 14
  (1, 1, 'Blanco',  FALSE), -- id_voto 15
  (4, 1, 'Blanco',  FALSE); -- id_voto 16

INSERT INTO voto_papeleta (id_voto, id_papeleta) VALUES
  (9, 1),   -- Interna FA
  (10, 1),  -- Interna FA
  (11, 2),  -- Interna PN
  (12, 2),  -- Interna PN (observado)
  (13, 3),  -- Interna PC
  (14, 3);  -- Interna PC (anulado)
  -- id_voto 15, 16 (Blanco): sin papeletas asociadas

-- ------------------------------------------------------------
-- Elección 2 – Presidencial (circuitos con mesa: 1, 2, 3, 4, 6)
-- Cada voto elige fórmula + lista al Senado + lista a Diputados
-- (esta última solo existe para circuitos de Montevideo).
-- ------------------------------------------------------------
INSERT INTO voto (id_circuito, id_eleccion, estado, es_observado) VALUES
  (1, 2, 'Valido',  FALSE), -- id_voto 17
  (1, 2, 'Valido',  FALSE), -- id_voto 18
  (2, 2, 'Valido',  FALSE), -- id_voto 19
  (2, 2, 'Valido',  TRUE),  -- id_voto 20 (observado)
  (3, 2, 'Valido',  FALSE), -- id_voto 21
  (4, 2, 'Valido',  FALSE), -- id_voto 22
  (4, 2, 'Anulado', FALSE), -- id_voto 23
  (6, 2, 'Valido',  FALSE), -- id_voto 24
  (6, 2, 'Blanco',  FALSE); -- id_voto 25

INSERT INTO voto_papeleta (id_voto, id_papeleta) VALUES
  (17, 4), (17, 8), (17, 11),  -- Fórmula FA + Senado FA + Diputados FA (Montevideo)
  (18, 4), (18, 8), (18, 11),
  (19, 5), (19, 9), (19, 12),  -- Fórmula PN + Senado PN + Diputados PN (Montevideo)
  (20, 5), (20, 9), (20, 12),  -- (observado)
  (21, 6), (21, 10), (21, 13), -- Fórmula PC + Senado PC + Diputados PC (Montevideo)
  (22, 7),                     -- Fórmula CA (sin listas propias en este dataset)
  (23, 4), (23, 9),            -- combinación FA + Senado PN => anulado
  (24, 4), (24, 8);            -- Fórmula FA + Senado FA (circuito de Canelones, sin lista de Diputados Montevideo)
  -- id_voto 25 (Blanco): sin papeletas asociadas

-- ------------------------------------------------------------
-- Elección 3 – Ballotage (circuitos con mesa: 1, 2, 5)
-- ------------------------------------------------------------
INSERT INTO voto (id_circuito, id_eleccion, estado, es_observado) VALUES
  (1, 3, 'Valido', FALSE), -- id_voto 26
  (1, 3, 'Valido', FALSE), -- id_voto 27
  (2, 3, 'Valido', FALSE), -- id_voto 28
  (2, 3, 'Valido', TRUE),  -- id_voto 29 (observado)
  (5, 3, 'Valido', FALSE), -- id_voto 30
  (5, 3, 'Blanco', FALSE); -- id_voto 31

INSERT INTO voto_papeleta (id_voto, id_papeleta) VALUES
  (26, 14), -- Fórmula FA – Segunda Vuelta
  (27, 14),
  (28, 15), -- Fórmula PN – Segunda Vuelta
  (29, 15),
  (30, 14);
  -- id_voto 31 (Blanco): sin papeletas asociadas

-- ------------------------------------------------------------
-- Elección 4 – Municipal: más circuitos y departamentos además
-- de los ya cargados en 01_inserts.sql (circuitos 1 y 8).
-- ------------------------------------------------------------
INSERT INTO voto (id_circuito, id_eleccion, estado, es_observado) VALUES
  (3,  4, 'Valido',  FALSE), -- id_voto 32 (Montevideo)
  (3,  4, 'Valido',  FALSE), -- id_voto 33
  (4,  4, 'Valido',  FALSE), -- id_voto 34
  (4,  4, 'Anulado', FALSE), -- id_voto 35
  (6,  4, 'Valido',  FALSE), -- id_voto 36 (Canelones)
  (6,  4, 'Valido',  FALSE), -- id_voto 37
  (7,  4, 'Valido',  FALSE), -- id_voto 38
  (7,  4, 'Blanco',  FALSE), -- id_voto 39
  (9,  4, 'Blanco',  FALSE), -- id_voto 40 (Salto: sin papeletas propias en este dataset)
  (9,  4, 'Blanco',  FALSE), -- id_voto 41
  (10, 4, 'Blanco',  FALSE), -- id_voto 42 (Paysandú: ídem)
  (10, 4, 'Anulado', FALSE), -- id_voto 43
  (12, 4, 'Blanco',  FALSE), -- id_voto 44 (Rivera: ídem)
  (12, 4, 'Blanco',  FALSE); -- id_voto 45

INSERT INTO voto_papeleta (id_voto, id_papeleta) VALUES
  (32, 16), (32, 19), -- Intendente FA + Junta FA (Montevideo)
  (33, 17), (33, 20), -- Intendente PN + Junta PN (Montevideo)
  (34, 18),           -- Intendente PC (Montevideo, sin lista de Junta PC en este dataset)
  (35, 16), (35, 20), -- combinación Intendente FA + Junta PN => anulado
  (36, 21),           -- Concejo Municipal FA (Canelones)
  (37, 21),
  (38, 22);           -- Concejo Municipal PN (Canelones)
  -- id_voto 39, 40, 41, 42, 44, 45 (Blanco): sin papeletas asociadas
  -- id_voto 43 (Anulado, Paysandú): sin papeletas asociadas

-- ------------------------------------------------------------
-- Partido Independiente: en 01_inserts.sql no tenía ninguna
-- papeleta propia, por lo que no aparecía nunca en
-- v_votos_por_partido / v_votos_por_candidato. Se agrega una
-- fórmula presidencial para que las 5 fuerzas políticas tengan
-- votos en algún reporte.
-- ------------------------------------------------------------
INSERT INTO papeleta (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento) VALUES
  (2, NULL, FALSE, 'Fórmula Presidencial PI 2024', 'Celeste', 5, NULL, NULL); -- id_papeleta 28

INSERT INTO papeleta_candidato_apoyo (id_papeleta, cedula_candidato) VALUES
  (28, '99999999'), -- Jorge Gianotti Mazzini (presidente del partido)
  (28, '10101010'); -- Lucía Ramírez Da Silva (vicepresidenta del partido)

INSERT INTO voto (id_circuito, id_eleccion, estado, es_observado) VALUES
  (3, 2, 'Valido', FALSE), -- id_voto 46
  (1, 2, 'Valido', FALSE); -- id_voto 47

INSERT INTO voto_papeleta (id_voto, id_papeleta) VALUES
  (46, 28),
  (47, 28);

-- ============================================================
--  FIN DEL ARCHIVO
-- ============================================================
