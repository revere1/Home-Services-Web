interface Scripts {
    name: string;
    src: string;
}  
export const ScriptStore: Scripts[] = [
    {name: 'jquery', src: '../../../assets/js/jquery.min.js'},
    {name: 'bootstrap', src: '../../../assets/js/bootstrap.min.js'},
    {name: 'adminlte', src: '../../../assets/js/adminlte.min.js'},
    {name: 'morris', src: '../../../assets/js/pages/morris.min.js'},
    {name: 'moment', src: '../../../assets/js/pages/moment.min.js'},
    {name: 'datepicker', src: '../../../assets/js/pages/bootstrap-datepicker.min.js'},
    {name: 'dashboard', src: '../../../assets/js/pages/dashboard.js'},
    {name: 'raphael', src: '../../../assets/js/pages/raphael.min.js'},
];