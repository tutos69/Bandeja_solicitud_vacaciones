# Vacaciones App

> **Credenciales por defecto (modo desarrollo JHipster)**
>
> | Usuario | Rol                          | Contraseña |
> | ------- | ---------------------------- | ---------- |
> | `admin` | Administrador (`ROLE_ADMIN`) | `admin`    |
> | `user`  | Usuario (`ROLE_USER`)        | `user`     |
>
> Estos usuarios se crean automáticamente solo en modo DEV.  
> Para pruebas reales, crear usuarios y asociarlos a empleados.

---

Aplicación para la gestión de solicitudes de vacaciones, basada en **JHipster** (Spring Boot + Angular\*\*).  
El sistema incorpora las entidades `Employee` y `VacationRequest`, y utiliza la entidad incorporada `User` para autenticación y control de acceso.

---

## 1. Modelo de Datos (JDL)

```jdl
enum VacationStatus {
  PENDING,
  APPROVED,
  APPROVED_WITH_CHANGES,
  REJECTED
}

entity Employee {
  firstName String required
  lastName  String required
  startDate LocalDate required
}

entity VacationRequest {
  startDate         LocalDate required
  endDate           LocalDate required
  requestedDays     Integer  required
  status            VacationStatus required
  approverComment   String maxlength(500)
  approvedStartDate LocalDate
  approvedEndDate   LocalDate
  approvedDays      Integer
  createdAt         Instant required
  decidedAt         Instant
}

relationship OneToOne {
  Employee{user(login) required} to User with builtInEntity
}

relationship ManyToOne {
  VacationRequest{employee required} to Employee
}

relationship ManyToOne {
  VacationRequest{approver(login)} to User with builtInEntity
}

dto Employee, VacationRequest with mapstruct
service Employee, VacationRequest with serviceClass
```

---

## 2. Control de Acceso

- **ROLE_ADMIN**

  - Acceso de lectura a **todas** las solicitudes.
  - Permisos de aprobación y administración.

- **Usuario Estándar (Employee)**
  - Acceso a **solo sus propias solicitudes**.
  - Requiere estar vinculado como `Employee`.

---

## Requisitos Previos

- Java 17+
- Node.js 18 o 20
- Yarn o npm
- Instalar JHipster:
  ```bash
  npm install -g generator-jhipster
  ```
- (Opcional) Docker

> Las entidades, relaciones y migraciones se generan automáticamente por **JHipster**.

---

## Configuración Base de Datos (DEV)

Editar `src/main/resources/config/application-dev.yml`:

```yaml
spring:
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    url: jdbc:postgresql://localhost:5432/demo
    username: postgres
    password: '1213'
```

### Deshabilitar Docker Compose automático

```yaml
docker:
  compose:
    enabled: false
```

---

## Ejecución

### Backend

```bash
./mvnw
```

### Frontend

```bash
cd src/main/webapp
npm install
npm start
```

---

## Flujo de Uso

1. Iniciar sesión con `admin/admin` o `user/user`.
2. Asociar el usuario a un `Employee`.
3. Crear solicitudes `VacationRequest`.
4. Validación:

- Usuario estándar: solo sus solicitudes
- Admin: todas

---

## Troubleshooting

| Problema           | Solución                       |
| ------------------ | ------------------------------ |
| No veo solicitudes | Asociar `User` a `Employee`.   |
| Veo todas          | Usuario tiene `ROLE_ADMIN`.    |
| Error BD           | Revisar `application-dev.yml`. |

---

## Licencia

Uso interno / académico.
