export const state = () => ({
  drugs: {},
  tanggals: {},
  stocks: {}
});

export const getters = {
  getTanggals: ( { tanggals }) => tanggals,
  getStocks: ({ stocks }) => stocks
}

export const mutations = {
  addDrug: ( { drugs }, drug ) => drugs[drug.id] = Object.assign( {}, drugs[drug.id], drug ),
  addTanggal: ( { tanggals }, { tanggal, tgl, bln }) => {
    let e = {}
    e[tgl] = {
      value: `${tgl}`,
      text: `${tgl}`
    }
    tanggals[bln] = Object.assign({}, tanggals[bln], e)
  },
  addStock: ( { stocks, drugs }, recipe) => {
    let { tgl, bln, drug_id, jumlah } = recipe
    let { id, nama, satuan } = drugs[drug_id]
    let stockBlnDrugID = {
      id, nama, satuan,
      jml: stocks[bln] && stocks[bln][drug_id] && stocks[bln][drug_id].jml ? stocks[bln][drug_id].jml + jumlah : jumlah
    }
    stockBlnDrugID[tgl] = stocks[bln] && stocks[bln][drug_id] && stocks[bln][drug_id][tgl] ? stocks[bln][drug_id][tgl] + jumlah : jumlah
    let stockBln = {}
    stockBln[drug_id] = Object.assign({}, stocks[bln] && stocks[bln][drug_id] ? stocks[bln][drug_id] : {}, stockBlnDrugID)
    stocks[bln] = Object.assign({}, stocks[bln], stockBln)
  }
}

export const actions = {
  async fetchDrugs(store) {
    let { data: { data: { drugsGet }}} = await this.$axios.post('/graphiql', {
      query: `{ drugsGet { id nama satuan } }`
    })
    for(let drug of drugsGet) {
      store.commit('addDrug', drug)
    }
  },
  async fetchVisits(store, bulan ) {
    if(!bulan){
      bulan = this.$moment().format('YYYY-MM')
    }
    let { data: { data: { visitsGet }}} = await this.$axios.post('/graphiql', {
      query: `{ visitsGet(where:{ tanggal: { startsWith: "${ bulan }" }}){ id tanggal recipes{ id drug_id jumlah } } }`
    })
    for(let visit of visitsGet){
      if(visit.recipes.length) {
        let tArr = visit.tanggal.split('-')
        let tgl = Number(tArr[2])
        let bln = [ tArr[0], tArr[1] ].join('-')
        if(!store.state.tanggals[bln] || (store.state.tanggals[bln] && !store.state.tanggals[bln][tgl])) {
          store.commit('addTanggal', { tanggal: visit.tanggal, tgl, bln } )
        }
        for(let recipe of visit.recipes) {
          store.commit('addStock', Object.assign({}, recipe, { tgl, bln }))
        }
      }
    }
  }

}