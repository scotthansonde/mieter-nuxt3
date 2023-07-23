<template>
  <span>
    <v-btn color="primary" class="mb-2 mr-2" @click="showPDF">Show PDF</v-btn>
    <v-btn color="success" class="mb-2" @click="savePDF">Save PDF</v-btn>
  </span>
</template>

<script>
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Roboto from '@/assets/fonts/Roboto-Regular-normal'
import RobotoBold from '@/assets/fonts/Roboto-Bold-bold'
export default {
  props: {
    table: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    newStyle: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    savePDF() {
      const doc = this.createPDF()
      doc.save(`${this.title}.pdf`)
    },
    showPDF() {
      const doc = this.createPDF()
      // doc.output('pdfobjectnewwindow', { filename: `${this.title}.pdf` })
      doc.output('pdfobjectnewwindow')
    },
    createPDF() {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF()
      const newStyle = this.newStyle
      doc.addFileToVFS('Roboto.ttf', Roboto)
      doc.addFileToVFS('Roboto Bold.ttf', RobotoBold)
      doc.addFont('Roboto.ttf', 'Roboto', 'normal')
      doc.addFont('Roboto Bold.ttf', 'Roboto', 'bold')
      doc.setFont('Roboto')
      doc.text(this.title, 10, 10)
      autoTable(doc, {
        html: this.table,
        theme: 'striped',
        styles: {
          font: 'Roboto',
          textColor: 'black',
          cellPadding: 1,
          fontSize: 8,
        },
        headStyles: { font: 'Roboto' },
        didParseCell: function (data) {
          if (newStyle && data.column.index === 6) {
            data.cell.styles.fontStyle = 'bold'
          }
        },
      })
      return doc
    },
  },
}
</script>
