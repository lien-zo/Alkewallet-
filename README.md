

# Alke Wallet

Una aplicación de billetera digital que permite a los usuarios gestionar sus activos financieros de manera segura y conveniente.

## Descripción del Proyecto

Alke Wallet es una aplicación web frontend desarrollada para simular una billetera digital. Permite a los usuarios:

- Iniciar sesión con credenciales seguras
- Ver su saldo disponible
- Realizar depósitos de fondos
- Enviar dinero a otros usuarios
- Ver el historial completo de transacciones
- Gestionar contactos para transferencias futuras

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de las páginas
- **CSS3**: Estilos responsivos y diseño atractivo
- **JavaScript (ES6+)**: Lógica de la aplicación y validaciones
- **Bootstrap 4.6.2**: Framework CSS para diseño responsive
- **jQuery 3.6.0**: Manipulación del DOM y efectos interactivos
- **Local Storage**: Persistencia de datos del lado del cliente

## Estructura del Proyecto

```
Alke Wallet/
├── index.html              # Página de inicio
├── pages/
│   ├── login.html          # Página de inicio de sesión
│   ├── menu.html           # Menú principal del usuario
│   ├── deposit.html        # Página de depósito de fondos
│   ├── sendmoney.html      # Página de envío de dinero
│   └── transactions.html   # Historial de transacciones
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── login.js            # Lógica de autenticación
│   ├── menu.js             # Dashboard del usuario
│   ├── deposit.js          # Procesamiento de depósitos
│   ├── sendmoney.js        # Transferencias de dinero
│   └── transactions.js     # Gestión del historial
└── README.md               # Documentación del proyecto
```

## Usuarios de Prueba

| Email | Password | Balance |
|-------|----------|---------|
| usuario@email.com | 123456 | CLP $1,500,000 |
| test@email.com | password | CLP $1,500,000 |

## Instalación y Ejecución

1. Clona o descarga el repositorio
2. Abre el proyecto en tu editor de código (VS Code recomendado)
3. Ejecuta un servidor local:
   ```bash
   # Usando Python
   python -m http.server 8000

   # O usando Node.js
   npx http-server

   # O cualquier servidor web local
   ```
4. Abre tu navegador y ve a `http://localhost:8000`
5. Haz clic en "Iniciar Sesión" y usa las credenciales de prueba

## Funcionalidades Implementadas

### ✅ Autenticación
- Inicio de sesión con validación de credenciales
- Sesión persistente usando Local Storage
- Validación en tiempo real de email y contraseña

### ✅ Dashboard
- Visualización del saldo actual
- Estadísticas rápidas (total de transacciones, contactos)
- Navegación intuitiva entre secciones

### ✅ Depósitos
- Formulario de depósito con validaciones
- Selección de método de pago
- Actualización automática del saldo
- Registro de transacciones

### ✅ Transferencias
- Búsqueda y selección de contactos
- Autocompletado con jQuery
- Validación de saldo suficiente
- Confirmación de transferencias
- Actualización de saldos de ambos usuarios

### ✅ Historial de Transacciones
- Vista completa de todas las transacciones
- Filtros por tipo (depósitos, transferencias enviadas/recibidas)
- Ordenamiento por fecha
- Estadísticas resumidas

### ✅ Diseño Responsivo
- Compatible con dispositivos móviles y desktop
- Uso de Bootstrap para layouts adaptativos
- Interfaz intuitiva y moderna

## Validaciones Técnicas

- **Legibilidad del código**: Código bien estructurado con comentarios
- **Experiencia de usuario**: Interfaz fluida con animaciones jQuery
- **Validaciones**: Controles en tiempo real y mensajes de error
- **Persistencia**: Datos almacenados localmente (Local Storage)
- **Seguridad**: Validación de sesiones y acceso controlado

