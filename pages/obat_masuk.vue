<template lang="pug">
	v-row
		.col-sm.pa-auto
			v-card(outlined hover)
				v-card-title 
					v-toolbar-title Data Obat Masuk
					v-spacer
					v-text-field(dense append-icon='mdi-table-search' label='Cari' v-model='search')
				v-card-text
					v-data-table.elevation-1( divider @click:row="editItem" :headers='column' :items='drugs' item-key='_key' :items-per-page='10' :search='search' :loading='loading')
				v-fab-transition
					v-btn( color="primary" :absolute="!$vuetify.breakpoint.smAndDown" :fixed="$vuetify.breakpoint.smAndDown" bottom right fab @click='showInput = !showInput')
						v-icon mdi-plus
		.col-sm.pa-auto(v-if="showInput")
			v-card(outlined hover)
				v-card-title 
					v-toolbar-title Input Penerimaan Obat
				v-card-text
					v-autocomplete( outlined label='Cari Obat' :items='drugsNama' v-model='drugSelected' dense)
					template(v-if='drugSelected')
						v-text-field( outlined label='No Batch' v-model='drugBatch' dense)
						v-text-field( v-if='drugBatch' type='number' outlined label='Jumlah' v-model='drugJml' dense)
						v-text-field( dense v-if='drugJml' outlined label="Harga Satuan" v-currency="{currency: 'IDR', locale: 'id'}" v-model="drugPrice")
					template(v-if='drugJml')
						v-text-field( dense outlined v-model="drugED" label="Tanggal ED" readonly @focus='modal2 = true' @click='modal2 = true')
						v-dialog( dense ref="dialog2" v-model="modal2" :return-value.sync="drugED" persistent width="290px")
							v-date-picker(v-model="drugED" type="date" :no-title='!drugED' locale='id' scrollable @input="$refs.dialog2.save(drugED)")
						v-text-field( dense outlined v-model="drugTerima" label="Tanggal Terima" readonly @focus='modal1 = true' @click='modal1 = true') 
						v-dialog( dense ref="dialog1" v-model="modal1" :return-value.sync="drugTerima" persistent width="290px")
							v-date-picker(v-model="drugTerima" type="date" locale='id' scrollable @input="$refs.dialog1.save(drugTerima)")
				v-card-actions
					v-spacer
					v-btn(@click="batal" depressed) Batal
					v-btn(:disabled="!(drugSelected && drugTerima && drugED && drugPriced && drugBatch)" color="primary" :loading="simpanLoading" @click="simpan") Simpan
		.col-sm.pa-auto(v-if='drugSelected')
			v-card(outlined hover)
				v-card-title 
					v-toolbar-title Detail Obat
				v-card-text
					v-list(two-line dense)
						v-list-item
							v-list-item-icon 
								v-icon mdi-id-card
							v-list-item-content
								v-list-item-title {{ drugSelected }}
								v-list-item-subtitle {{ drugID }}
						v-list-item(v-if='drugBatch')
							v-list-item-icon 
								v-icon mdi-rename-box
							v-list-item-content
								v-list-item-title No Batch: {{ drugBatch }}
								v-list-item-subtitle(v-if="drugKey") No Register Input: {{ drugKey }}
							v-list-item-content(v-if='drugPrice')
								v-list-item-title
									currency-input(v-model="drugPriced" locale='id' readonly disabled) 
								v-list-item-subtitle Harga Satuan
						v-list-item(v-if='drugJml')
							v-list-item-icon 
								v-icon mdi-pill
							v-list-item-content
								v-list-item-title {{ drugJml }}
								v-list-item-subtitle Jumlah
							v-list-item-content(v-if='drugSatuan')
								v-list-item-title {{ drugSatuan }}
								v-list-item-subtitle Satuan
						v-list-item(v-if='drugJml')
							v-list-item-icon 
								v-icon mdi-calendar
							v-list-item-content(v-if='drugTerima')
								v-list-item-title {{ drugTerima }}
								v-list-item-subtitle Tanggal Terima
							v-list-item-content(v-if='drugED')
								v-list-item-title {{ drugED }}
								v-list-item-subtitle Tanggal ED
				v-card-actions(v-if="!showInput")
					v-spacer
					v-btn(@click="batal" depressed) Kembali
					v-dialog(v-if="drugKey" v-model="modalHapus" persistent max-width="290")
						template(v-slot:activator="{ on }")
							v-btn(color="error" :loading="deleteLoading" dark v-on="on" outlined) Hapus
						v-card
							v-card-title.headline Yakin menghapus input penerimaan obat?
							v-card-actions
								v-spacer
								v-btn(color="error darken-1" text @click="deleteItem") Ya, Hapus
								v-btn(color="green darken-1" text @click="modalHapus = false") Batalkan
					v-btn(:disabled="!(drugSelected && drugTerima && drugED && drugPriced && drugBatch)" color="warning" :loading="simpanLoading" @click="showInput = true") Edit
</template>

<script>
export default {
	data: () => ({
		modalHapus: false,
		showInput: false,		
		modal1: false,
		modal2: false,
		drugKey: null,
		drugTerima: null,
		drugSelected: null,
		drugPrice: null,
		drugBatch: null,
		drugED: null,
		drugJml: null,
		drugPriced: 0,
		simpanLoading: false,
		deleteLoading: false,
		column: [
			{
				value: 'nama',
				text: 'Nama'
			}, {
				value: 'jml',
				text: 'Jumlah'
			}, {
				value: 'batch',
				text: 'No Batch'
			}, {
				value: 'harga',
				text: 'Harga'
			}, {
				value: 'tglTerima',
				text: 'Tanggal Terima'
			},{
				value: 'tglED',
				text: 'Tanggal ED'
			}
		],
		search: '',
		loading: false,
	}),
	computed: {
		drugsNama() {
			return this.drugsGet.map(({ nama }) => nama)
		},
		drugSatuan() {
			return this.drugsGet.filter(({ nama, satuan }) => this.drugSelected === nama)[0].satuan
		},
		drugID() {
			return this.drugsGet.filter(({ nama, id }) => this.drugSelected === nama)[0].id
		},
		drugIDs(){
			return this.drugsGet.map( ({ id }) => id)
		},
		drugs() {
			return [...this.obatMasuk.map(e => Object.assign( {}, e, this.drugsGet[this.drugIDs.indexOf(e.id)]))]
		}
	},
	methods: {
		editItem(item) {
			this.drugSelected = this.drugsGet.filter( ({ id }) => id === item.id)[0].nama
			this.drugKey = item._key
			this.drugTerima = item.tglTerima
			this.drugPrice = item.harga
			this.drugBatch = item.batch
			this.drugED = item.tglED
			this.drugJml = item.jml
			this.showInput = false
			this.modalHapus = false
		},
		async deleteItem(){
			this.deleteLoading = true
			let { data: { data: { hapusObat } }} = await this.$axios.post('/graphql', {
				query: `mutation { hapusObat( _key: "${this.drugKey}") { _key } }`
			})

			this.obatMasuk = this.obatMasuk.filter( e => e._key !== this.drugKey)

			this.drugTerima = null
			this.drugKey = null
			this.drugSelected = null
			this.drugPrice = null
			this.drugBatch = null
			this.drugED = null
			this.drugJml = null
			this.drugPriced = 0
			this.deleteLoading = false

		},
		batal(){
			this.drugTerima = null
			this.drugKey = null
			this.drugSelected = null
			this.drugPrice = null
			this.drugBatch = null
			this.drugED = null
			this.drugJml = null
			this.drugPriced = 0
			this.simpanLoading = false
			this.showInput = false
		},
		async simpan() {
			this.simpanLoading = true
			let { data: { data: { terimaObat } }} = await this.$axios.post('/graphql', {
				query: `mutation { terimaObat( ${this.drugKey ? `_key: "${this.drugKey}"` : ''} id: "${this.drugID}" batch: "${this.drugBatch}" harga: ${this.drugPriced} jml: ${this.drugJml} tglTerima: "${this.drugTerima}" tglED: "${this.drugED}") { _key }}`
			})
			if(!this.drugKey) {
				this.obatMasuk.push(Object.assign( {}, terimaObat, {
					id: this.drugID,
					batch: this.drugBatch,
					harga: this.drugPriced,
					jml: this.drugJml,
					tglED: this.drugED,
					tglTerima: this.drugTerima
				}))
			} else {
				this.$set(this.obatMasuk, this.obatMasuk.map(({_key}) => _key).indexOf(this.drugKey), Object.assign( {}, this.obatMasuk[this.obatMasuk.map(({_key}) => _key).indexOf(this.drugKey)], {
					id: this.drugID,
					batch: this.drugBatch,
					harga: this.drugPriced,
					jml: this.drugJml,
					tglED: this.drugED,
					tglTerima: this.drugTerima
				}))
			}
			this.drugKey = null
			this.drugTerima = null
			this.drugSelected = null
			this.drugPrice = null
			this.drugBatch = null
			this.drugED = null
			this.drugJml = null
			this.drugPriced = 0
			this.simpanLoading = false
			this.showInput = false

		}
	},
	watch: {
		drugPrice() {
			this.drugPriced = Number(this.drugPrice)
		},
		drugJml() {
			this.drugTerima = this.$moment().format('YYYY-MM-DD')
		},
		drugTerima(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.modal1 = false
			}
		},
		drugED(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.modal2 = false
			}
		},
	},
	async asyncData({ $axios }) {
		try {
			const [ { data: { data: { drugsGet }}}, { data: { data: { obatMasuk }}}] = await Promise.all([
				$axios.post('/graphiql', {
					query: `{ drugsGet{ id nama satuan } }`
				}),
				$axios.post('/graphql', {
					query: `{ obatMasuk { _key id jml batch harga tglED tglTerima } }`
				}),
			])
			return {
				drugsGet,
				obatMasuk
			}
		} catch (e) {
			console.error(e)
		}
	}
}
</script>
