import {
    BriefcaseIcon,
    RectangleGroupIcon,
    HomeIcon,
    CalculatorIcon,
    UserGroupIcon,
    TruckIcon
} from '@heroicons/react/16/solid'
export function MenuNodes() {
    return Promise.resolve([
        {
            id: "1",
            name: "Inicio",
            route: "/",
            icon: () => <HomeIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />
        },
        {
            id: "2",
            name: "Proyectos",
            route: "/projects",
            icon: () => <BriefcaseIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />,
            children: []

        },
        {
            id: "3",
            name: "Facturacion",
            route: "/facturacion",
            icon: () => <CalculatorIcon class="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />,
            children: []

        },
        {
            id: "4",
            name: "Clientes",
            route: "/Clientes",
            icon: () => <UserGroupIcon class="h-6 w-6 text-gray-500" />,
            children: []

        }
        ,
        {
            id: "5",
            name: "Proveedores",
            route: "/Proveedores",
            icon: () => <TruckIcon class="h-6 w-6 text-gray-500" />,
            children: []

        }
        ,
        {
            id: "6",
            name: "Productos",
            route: "/stock",
            icon: () => <RectangleGroupIcon class="h-6 w-6 text-gray-500" />,
            children: []

        }
    ]);

}