<template lang="pug">
	v-row
		.col-sm.pa-auto
			v-card(outlined hover)
				v-card-title 
					v-toolbar-title Data Stok Obat {{ periodeFormat }} 
						month-picker( @update='val => periode = val')
					v-spacer
					v-text-field(dense append-icon='mdi-table-search' label='Cari' v-model='search')
				v-card-text
					v-data-iterator(:items='drugsGet' single-expand show-expand :search='search' )
						template(v-slot:default="{ items, isExpanded, expand }")
							v-card.ma-2(v-for="(item, i) in items" :key='i'  @click='expand(item, !isExpanded(item))')
								v-list-item 
									v-list-item-icon
										v-icon(small color="error") mdi-alert-circle-outline		
									v-list-item-subtitle {{item.nama}}
									v-spacer
									v-btn(icon @click="expand(item, !isExpanded(item))")
										v-icon {{ isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
								template(v-if='isExpanded(item)')
									v-divider
									v-card-text(v-if='!item.jml' color='error') Stok belum terbentuk. Silahkan lakukan Stok Opname
									v-card-text(v-else) {{ item }}
				v-fab-transition
					v-btn( color="primary" :absolute="!$vuetify.breakpoint.smAndDown" :fixed="$vuetify.breakpoint.smAndDown" bottom right fab)
						v-icon mdi-plus
</template>

<script>
export default {
	components: {
		MonthPicker: () => import('~/components/month_picker.vue')
	},
	data: () => ({
		show: false,
		loading: true,
		periode: null,
		periodeMenu: false,
		search: '',
	}),
	computed: {
		drugs() {
			return this.drugsGet
		},
		periodeFormat(){
			return this.periode ? this.$moment(this.periode, 'YYYY-MM-DD').format('MMMM YYYY') : this.$moment().format('MMMM YYYY')
		}
	},
	methods: {
		monthSelector(){

		},
		editItem(item){
			console.log(item)
		}
	},
	watch: {
	},
	async asyncData({ $axios }) {
		try {
			const [ { data: { data: { drugsGet }}}] = await Promise.all([
				$axios.post('/graphiql', {
					query: `{ drugsGet{ id nama satuan } }`
				}),
			])
			return {
				drugsGet,
			}
		} catch (e) {
			console.error(e)
		}
	}
}
</script>
