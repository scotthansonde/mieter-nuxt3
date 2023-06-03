import { Schema, model } from 'mongoose'

const productSchema = new Schema({
  name: String,
  desc: String,
  property: String,
  type: String,
  period: String,
  defaultPrice: Number,
  tax: Number,
  attributes: {
    type: [String],
    // enum: ["Daily", "Onetime"]
  },
})

productSchema.virtual('lohnart').get(function () {
  const lohnarts = {
    Wohnung: '1049',
    'MIET-Z': '1049',
    'MIET-K': '1049',
    Nebenkosten: '1049',
    Fremdwohnung: '203',
    Umlagen: '203',
    Schuhe: '1143',
    'BEF-Z': '1057',
    Vorschuss: '203',
    Darlehen: 'xxx',
    Erstattung: '1057',
    'K-EIN': '1056',
    'K-AUS': '1053',
    Bonus: '1217',
    'Crew Bonus': '1217',
    'FAHR-Z': '1057',
    'J-BON': '1222',
    'N-KORR': '1034',
    JSZW: '50',
  }
  return lohnarts[this.name] || lohnarts[this.type]
})

productSchema.virtual('lohnartSign').get(function () {
  const switches = {
    'K-AUS': -1,
  }
  return switches[this.name] || switches[this.type] || 1
})

productSchema.virtual('kostenstelle').get(function () {
  const kostenstellen = {
    Fremdwohnung: '400',
    Umlagen: '400',
    Wohnung: '401',
    'MIET-Z': '401',
    'TRAN-Z': '401',
    'MIET-K': '401',
    Nebenkosten: '401',
    Schuhe: '400',
    'BEF-Z': '400',
    'K-EIN': '401',
    'K-AUS': '401',
    'FAHR-Z': '400',
  }
  return kostenstellen[this.name] || kostenstellen[this.type]
})
// productSchema.virtual('fibu').get(function() {
//   const fibuAccounts = {
//     Wohnung: '860041',
//     Mietzahlung: '860041',
//     Fremdwohnung: '174000',
//     Schuhe: '179230',
//     Kaution: '173200',
//     Beförderung: '864100',
//     Vorschuss: '174000',
//     Darlehen: 'xxx',
//     Erstattung: '864100',
//   };
//   return fibuAccounts[this.type];
// });

export default model('Product', productSchema)
