export class DataTableOptions {
  static get language() {
    return {
      search: ' ',
      zeroRecords: 'No se ha encontrado registros - lo lamento',
      info: 'Mostrando página _PAGE_ de _PAGES_',
      infoEmpty: 'No hay más registros',
      infoFiltered: '(Filtrados de _MAX_ registros totales)',
      searchPlaceholder: 'Buscar',
      lengthMenu: 'Mostrar _MENU_ registros',
      buttons: {
        colvis: 'Mostrar/Ocultar columnas',
        copy: 'Copiar',
        csv: 'Exportar a CSV',
        excel: 'Exportar a Excel',
        pdf: 'Exportar a PDF',
        print: 'Imprimir'
      },
      paginate: {
        first: 'Primera',
        last: 'Última',
        next: 'Siguiente',
        previous: 'Anterior'
      }
    }
  }

  static getSpanishOptions(pageLength: number): DataTableOptions {
    return {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: pageLength,
      responsive: true,
      dom: 'Bfrtip',
      buttons: [],
      language: this.language,
    }
  }
}
