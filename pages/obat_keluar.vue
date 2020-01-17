<template lang="pug">
	v-card(outlined hover)
		v-card-title 
			v-toolbar-title Data Obat Keluar {{ periodeFormat }} 
				month-picker( @update='val => periode = val')
			v-spacer
			v-text-field(dense append-icon='mdi-table-search' label='Cari' v-model='search')
		v-data-table( dense divider :headers='computedColumns' :items='computedDrugs' :items-per-page='15' :search='search' :loading='loading')
</template>

<script>
export default {
	components: {
		MonthPicker: () => import('~/components/month_picker.vue')
	},
	data: () => ({
		search: '',
		periode: null,
		computedColumns: [],
		loading: true,
		computedDrugs:[]
	}),
	watch: {
		periode(nv, ov) {
			if(nv !== ov) {
				this.getData(this.periodes)
			}
		},
	},
	computed: {
		periodeFormat(){
			return this.periode ? this.$moment(this.periode, 'YYYY-MM').format('MMMM YYYY') : this.$moment().format('MMMM YYYY')
		},
		periodes(){
			return this.periode || this.$moment().format('YYYY-MM')
		},
	},
	methods: {
		async getData( bulan ) {
			this.loading = true
			await this.$store.dispatch('obat/fetchVisits', bulan)
			this.computedDrugs = [...Object.keys(this.$store.state.obat.stocks[bulan]).map((k, i) => this.$store.state.obat.stocks[bulan][k])]
			this.computedColumns = [{ value: 'nama',	text: 'Nama' }, { value: 'jml', text: 'Jumlah' }]
			Object.keys(this.$store.state.obat.tanggals[bulan]).map((e) => this.computedColumns.push(this.$store.state.obat.tanggals[bulan][e]))
			this.loading = false
		}
	},
	async beforeCreate() {
		try {
			await this.$store.dispatch('obat/fetchDrugs')
			await this.getData(this.periodes)
		}catch(e){
			console.error(e)
		}
	}
}
</script>
