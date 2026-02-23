-- 🔍 Supabase Security Audit Queries
-- Ejecuta estas queries en el editor SQL de Supabase para auditar la seguridad.

-- 1. Tablas sin RLS habilitado (¡CRÍTICO!)
SELECT 
    relname AS table_name
FROM 
    pg_class c
JOIN 
    pg_namespace n ON n.oid = c.relnamespace
WHERE 
    relkind = 'r' 
    AND n.nspname = 'public'
    AND NOT relrowsecurity;

-- 2. Políticas que permiten acceso total (USING true)
-- Revisa si esto es realmente lo que quieres para estas tablas.
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM 
    pg_policies 
WHERE 
    qual = '(true)' 
    OR qual = 'true';

-- 3. Funciones SECURITY DEFINER (Riesgo de escalada)
-- Verifica que estas funciones no tengan huecos de seguridad.
SELECT 
    proname AS function_name, 
    prosrc AS source_code
FROM 
    pg_proc p
JOIN 
    pg_namespace n ON n.oid = p.pronamespace
WHERE 
    prosecdef = true 
    AND n.nspname = 'public';

-- 4. Tablas con RLS pero sin políticas definidas
-- (Por defecto deniegan todo, lo cual es seguro, pero puede bloquear la app).
SELECT 
    relname AS table_name
FROM 
    pg_class c
JOIN 
    pg_namespace n ON n.oid = c.relnamespace
WHERE 
    relkind = 'r' 
    AND n.nspname = 'public'
    AND relrowsecurity
    AND NOT EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = c.relname
    );
