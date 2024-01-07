import { Schema, model } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

// We use German field names here because the source table has German columns

const personSchema = new Schema(
  {
    personalnummer: String,
    nachname: { type: String, required: 'You must supply nachname' },
    vorname: String,
    geburtsdatum: Date,
    geschlecht: String,
    nationalität: { type: String, alias: 'nationalitaet' },
    position: String,
    eintrittsdatum: Date,
    austrittsdatum: Date,
    vertragkost: String,
    lohnkost: String,
    straße: { type: String, alias: 'strasse' },
    plz: String,
    ort: String,
    status: String,
    // Strings from the MyPeople list
    myPeopleNachname: String,
    myPeopleVorname: String,
    myPeopleGeschlect: String,
    myPeopleOrtID: String,
    myPeopleID: String,
    myPeopleLokalePN: String,
    myPeoplePosition: String,
    myPeopleEintrittsdatum: Date,
    myPeopleStraße: { type: String, alias: 'myPeopleStrasse' },
    myPeoplePlz: String,
    myPeopleOrt: String,
    myPeopleGeburtsdatum: Date,
    myPeopleNationalität: { type: String, alias: 'myPeopleNationalitaet' },
    myPeopleKündigungstermin: Date,
    myPeopleKündigungAm: Date,
    myPeopleTarifgruppe: String,
    myPeopleTariflohn: String,
    myPeopleStundenlohn: String,
    myPeopleVertragsstundenTag: String,
    myPeopleVertragsstundenWoche: String,
    myPeopleVertragsstundenMonat: String,

    myPeopleReportDate: String,
    myPeopleHash: String,
  },
  {
    toJSON: { virtuals: true },
    toOjbect: { virtuals: true },
  },
)

personSchema.virtual('sortiername').get(function () {
  return `${this.nachname}, ${this.vorname}`
})

personSchema.virtual('pnSortiername').get(function () {
  return `${this.personalnummer} ${this.nachname}, ${this.vorname}`
})

personSchema.virtual('vollername').get(function () {
  return `${this.vorname} ${this.nachname}`
})

personSchema.virtual('kostenstelle').get(function () {
  return this.lohnkost ? this.lohnkost : this.vertragkost
})

personSchema.virtual('active').get(function () {
  return !this.austrittsdatum
})

personSchema.virtual('mandat').get(function () {
  const mandaten = {
    51252: '70',
    55047: '70',
    51591: '71',
    51284: '72',
    51242: '150',
    51341: '150',
    400: '71',
    SATS: '71',
    DRVS: '72',
  }
  return mandaten[this.kostenstelle]
})

personSchema.plugin(mongooseLeanVirtuals)

// personSchema.virtual('purchases', {
//   ref: 'Purchase',
//   localField: '_id',
//   foreignField: 'buyer',
// });

// personSchema.virtual('rentals', {
//   ref: 'Rental',
//   localField: '_id',
//   foreignField: 'buyer',
// });

export default model('Person', personSchema)
