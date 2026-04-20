# 🏨 Viajes Altairis - Sistema de Gestión Hotelera (MVP)

Viajes Altairis es una solución Fullstack contenerizada diseñada para gestionar la operatividad de hoteles, habitaciones y reservas. El sistema permite administrar todo el ciclo de vida de una reserva, garantizando la persistencia de datos relacionales y ofreciendo una interfaz de usuario moderna, rápida y responsiva.

Este proyecto ha sido desarrollado bajo una arquitectura orientada a microservicios simulada (Frontend y Backend separados) y orquestada completamente a través de Docker.

---

## 🚀 Inicio Rápido (Zero-Config)

El proyecto está diseñado para ser **"Plug & Play"**. No es necesario instalar SDKs de .NET ni Node.js en la máquina host.

### Requisitos Previos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine instalado.
* Docker Compose.

### Ejecución

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/jnavarrovanemis/Altairis.git](https://github.com/jnavarrovanemis/Altairis.git)
   cd Altairis
Levantar la infraestructura completa:

Bash
docker compose up --build -d
¡Listo! Los servicios estarán disponibles en:

🖥️ Frontend (Interfaz de Usuario): http://localhost:3000

⚙️ Backend (API REST): http://localhost:5000/api

🗄️ Base de Datos: localhost:1433 (SQL Server)