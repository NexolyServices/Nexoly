# Nexoly — API (endpoints iniciales)

Auth
- POST /api/auth/register { name, email, password, role_id } -> Register (returns token)
- POST /api/auth/login { email, password } -> Login (returns token)
- POST /api/auth/logout -> Logout (requires Authorization: Bearer <token>)

Catalog
- GET /api/services -> List services (filters: q, category, price_min, price_max, mode, location)
- GET /api/services/{id} -> Service detail

Orders / Cart
- POST /api/orders -> Create order (requires auth)
- GET /api/orders -> List user's orders

Payments (simulated)
- POST /api/orders/{id}/pay -> Simulate payment

Admin
- Protected endpoints for managing users, categories and moderating services.

---

Más endpoints se agregarán conforme avance la implementación.
