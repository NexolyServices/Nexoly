# Pruebas iniciales (plan)

Se agregan pruebas iniciales para las piezas críticas (MVP): autenticación, catálogo, carrito, pagos simulados y panel admin.

Autenticación:
- Test unitario: registro con datos válidos, contraseña encriptada.
- Test de integración: login devuelve token JWT válido; endpoint protegido rechaza request sin token.

Catalog:
- Test funcional: creación/edición/activación de servicios por proveedores.

Ordenes y Pagos:
- Test e2e: flujo cliente agrega servicio -> crea orden -> simula pago -> orden cambia a paid/confirmed.

Herramientas recomendadas:
- PHPUnit / Pest (backend)
- Cypress (end-to-end)
