# 🤖 AGENTS.md - Instrucciones para Agentes de IA

Bienvenido, Agente. Estás colaborando en el desarrollo de **RYŪKAMI**, una plataforma de e-commerce premium. Para mantener la excelencia, sigue estas instrucciones estrictamente.

## 📋 Guías Generales

1.  **Entorno Estricto**: El proyecto usa **Bun**. Usa siempre `bun` en lugar de `npm` para ejecutar comandos.
2.  **Integridad de TypeScript**: Todo código nuevo debe ser en TypeScript estricto. Nunca uses `any`. Añade esquemas de **Zod** para validaciones.
3.  **Excelencia en UI/UX**: RYŪKAMI es una marca de lujo.
    - Usa `framer-motion` para animaciones con sentido.
    - Sigue la paleta de colores definida en `README.md`.
    - Asegura que todo sea **Mobile-First**.

## 🛠️ Tareas Comunes

### Añadir un Nuevo Componente

- Crea elementos base en `src/components/ui`.
- Componentes de dominio en su carpeta correspondiente (ej. `src/components/cart`).
- Usa `clsx` para gestionar clases de Tailwind.

### Gestión de Estado

- Usa las stores de **Zustand** ubicadas en `src/store/`.
- Mantén las stores pequeñas y enfocadas.

## 🛑 Reglas Inquebrantables

- **Sin Placeholders**: No dejes comentarios tipo `// implementar aquí`. Entrega el código listo.
- **Validación Técnica**: Ejecuta siempre `bun run typecheck` después de modificar el código.

## 🔗 Referencia Técnica

- **Build Tool**: Vite 5
- **Estilos**: Tailwind CSS v4
- **Custom Skill**: Usa el skill `ryukami-standards` oficial de **Antigravity** ubicado en `.agent/skills/ryukami-standards/SKILL.md`.
