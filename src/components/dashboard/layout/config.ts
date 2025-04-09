import { paths } from '@/paths';
import { NavItemConfig } from '@/types/nav';

//TODO: para agregar iconos hay que dirigirse al archivo nav-icons.tsx

type SystemRole = 'superadmin' | 'user';
type CompanyRole = 'admin' | 'user';

// Funciones auxiliares
const getContabilidadItems = (empresaId: string | number): NavItemConfig[] => [
     { key: 'plan-cuentas', title: 'Plan de Cuentas', href: paths.dashboard.planCuentas(empresaId), icon: 'read-cv-logo' },
     { key: 'transaction', title: 'Transacciones', href: paths.dashboard.transacciones(empresaId), icon: 'cube' },
     { key: 'costCenter', title: 'Centro de Costos', href: paths.dashboard.centroCostos(empresaId), icon: 'cube' },
     { key: 'asiento', title: 'Asientos', href: paths.dashboard.asientos.index(empresaId), icon: 'cube' },
];

const getReportesItems = (empresaId: string | number): NavItemConfig[] => [
     { key: 'perdidas-ganancias', title: 'Pérdidas y Ganancias', href: paths.dashboard.perdidasGanancias(empresaId), icon: 'trend-up' },
     { key: 'balance-general', title: 'Balance General', href: paths.dashboard.balanceGeneral(empresaId), icon: 'scales' },
     { key: 'balance-comprobacion', title: 'Balance de Comprobación', href: paths.dashboard.balanceComprobacion(empresaId), icon: 'scales' },
     { key: 'mayor-general', title: 'Mayor General', href: paths.dashboard.mayorGeneral(empresaId), icon: 'list-numbers' },
     { key: 'libro-diario', title: 'Libro Diario', href: paths.dashboard.libroDiario(empresaId), icon: 'chart-pie' },
];


// Navegación fija para superadmin
const superadminNavItems: NavItemConfig[] = [
     {
          key: 'management',
          title: 'Gestión',
          items: [
               { key: 'overview', title: 'Dashboard', href: paths.admin.dashboard, icon: 'chart-bar' },
               { key: 'companies', title: 'Empresas', href: paths.admin.empresas, icon: 'building-office' },
               { key: 'users', title: 'Usuarios', href: paths.admin.usuarios, icon: 'users' },
          ],
     },
     {
          key: 'settings',
          title: 'Configuración',
          items: [
               {
                    key: 'settings',
                    title: 'Ajustes',
                    href: paths.admin.settings.account,
                    matcher: {
                         type: 'startsWith',
                         href: '/admin/dashboard/settings',
                    },
                    icon: 'gear',
               },
          ],
     },
];

// Navegación para Admin
const getAdminNavItems = (empresaId: string | number): NavItemConfig[] => [
     {
          key: 'dashboards',
          title: 'Dashboards',
          items: [
               { key: 'overview', title: 'Overview', href: paths.dashboard.overview(empresaId), icon: 'house' },
          ],
     },
     {
          key: 'general',
          title: 'General',
          items: [
               { 
                    key: 'contabilidad', 
                    title: 'Contabilidad', 
                    items: getContabilidadItems(empresaId) 
               },
               { 
                    key: 'reportes',
                    title: 'Reportes',
                    items: getReportesItems(empresaId) 
               },
          
          ],
     },
     {
          key: 'settings',
          title: 'Configuración',
          items: [
               {
                    key: 'settings',
                    title: 'Ajustes',
                    href: paths.dashboard.settings.account(empresaId),
                    matcher: {
                         type: 'startsWith',
                         href: `/empresa/${empresaId}/dashboard/settings`,
                    },
                    icon: 'gear',
               },
               { 
                    key: 'usuarios', 
                    title: 'Usuarios', 
                    href: paths.dashboard.usuarios(empresaId), 
                    icon: 'users' 
               },
          ],
     },
];

// Navegación para Usuario regular
const getRegularNavItems = (empresaId: string | number): NavItemConfig[] => [
     {
          key: 'dashboards',
          title: 'Dashboards',
          items: [
               { key: 'overview', title: 'Overview', href: paths.dashboard.overview(empresaId), icon: 'house' },
          ],
     },
     {
          key: 'general',
          title: 'General',
          items: [
               { key: 'contabilidad', title: 'Contabilidad', items: getContabilidadItems(empresaId) },
          ],
     },
     {
          key: 'settings',
          title: 'Configuración',
          items: [
               {
                    key: 'settings',
                    title: 'Ajustes',
                    href: paths.dashboard.settings.account(empresaId),
                    matcher: {
                         type: 'startsWith',
                         href: `/empresa/${empresaId}/dashboard/settings`,
                    },
                    icon: 'gear',
               },
          ],
     },
];


export const getLayoutConfig = (
     systemRole: SystemRole,
     companyRole: CompanyRole,
     empresaId: string | number
): NavItemConfig[] => {
     if (systemRole === 'superadmin') {
          if (companyRole === 'admin') {
               return getAdminNavItems(empresaId);
          }
          return superadminNavItems;
     }

     if (systemRole === 'user') {
          if (companyRole === 'admin') {
               return getAdminNavItems(empresaId);
          } else if (companyRole === 'user') {
               return getRegularNavItems(empresaId);
          }
     }

     // Por defecto
     return [];
};