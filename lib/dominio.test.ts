import { test } from "node:test";
import assert from "node:assert/strict";
import { validarRut, formatearRut } from "./rut.ts";
import { edadActual, edadAMarzo, puedeTransicionar } from "./matricula.ts";
import { puede, transicionesPermitidas } from "./permisos.ts";

test("RUT: valida el dígito verificador", () => {
  assert.equal(validarRut("12.345.678-5"), true);
  assert.equal(validarRut("12345678-K"), false);
  assert.equal(validarRut("11.111.111-1"), true);
  assert.equal(validarRut("20.000.004-K"), false);
  assert.equal(validarRut("7.654.321-6"), true);
  assert.equal(validarRut("abc"), false);
  assert.equal(formatearRut("123456785"), "12.345.678-5");
});

test("edades: actual y al 31 de marzo", () => {
  assert.equal(edadActual("2022-04-01", new Date(2026, 10, 9)), 4);
  assert.equal(edadActual("2022-11-10", new Date(2026, 10, 9)), 3);
  assert.equal(edadAMarzo("2022-03-31", 2027), 5);
  assert.equal(edadAMarzo("2022-04-01", 2027), 4);
  assert.equal(edadActual("no-es-fecha"), null);
});

test("ciclo de vida: solo transiciones de D03", () => {
  assert.equal(puedeTransicionar("PreInscrita", "FichaCompleta"), true);
  assert.equal(puedeTransicionar("PreInscrita", "Matriculada"), false);
  assert.equal(puedeTransicionar("EnListaDeEspera", "ListaParaFirmar"), true);
  assert.equal(puedeTransicionar("Matriculada", "Descartada"), false);
});

test("permisos por rol (D05)", () => {
  assert.equal(puede("Direccion", "cambiarOrigen"), true);
  assert.equal(puede("UTP", "cambiarOrigen"), false);
  assert.equal(puede("Secretaria", "editarFicha"), false);
  assert.equal(puede("Secretaria", "editarContacto"), true);
  assert.deepEqual(transicionesPermitidas("Secretaria", "Evaluada"), []);
  assert.deepEqual(transicionesPermitidas("Secretaria", "ListaParaFirmar"), ["Matriculada"]);
  assert.deepEqual(transicionesPermitidas("UTP", "Evaluada"), ["ListaParaFirmar", "EnListaDeEspera", "Descartada"]);
});
