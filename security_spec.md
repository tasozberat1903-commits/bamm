# Security Specification for BAMM Menu

## Data Invariants
- `products` collection items must have `name`, `price`, and `category`.
- Only authenticated admins can create, update, or delete products.
- Public can read products.
- Admins are identified by existence in `/admins/{userId}`.

## The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: Create product without login -> Expected: DENIED.
2. **Missing Required Field**: Create product without `price` -> Expected: DENIED.
3. **Invalid ID**: Create product with ID `!!!` -> Expected: DENIED.
4. **Field Type Mismatch**: Update `isPopular` with string "true" -> Expected: DENIED.
5. **Shadow Field**: Update product with `isAdmin: true` -> Expected: DENIED (via strictly defined update actions).
6. **Malicious Admin Escalation**: User `guest` tries to create `/admins/guest` -> Expected: DENIED.
7. **Bypass Relational Logic**: Update a product the user doesn't "own" (although in this app, all admins own all products) -> Expected: PASS for admin, DENIED for others.
8. **Resource Exhaustion**: Update name with 1MB string -> Expected: DENIED (size limit).
9. **Identity Spoofing**: Try to update `deleted` field without being an admin -> Expected: DENIED.
10. **Orphaned Record**: Create product with invalid category not in CATEGORIES (optional check) -> Expected: DENIED if enforced.
11. **PII Leak**: Read `/admins` collection as guest -> Expected: DENIED.
12. **Terminal State Lockdown**: (Not applicable here yet, but good to keep in mind).

## Red Team Audit
I will verify these cases in the rules.
