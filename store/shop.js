export const state = () => ({
  genres: [],
  shops: [],
  hasAcquiredAllShop: false,
  error: false,
  message: '',
  lat: '',
  lng: '',
  shopCount: null,
})

export const getters = {
  shops(state) {
    return state.shops
  },
  hasAcquiredAllShop(state) {
    return state.hasAcquiredAllShop
  },
  message(state) {
    return state.message
  },
  lat(state) {
    return state.lat
  },
  lng(state) {
    return state.lng
  },
  shopCount(state) {
    return state.shopCount
  },
}

export const mutations = {
  //レスポンス後の処理
  setGenre(state, res) {
    state.genres = res.data.results.genre
  },
  //エラーが発生した場合の処理
  setError(err) {
    state.error = true
  },
  // 検索結果のお店の一覧セット
  setShop(state, res) {
    if(res.data.results.shop.length > 0 ){
      state.shops = state.shops.concat(res.data.results.shop)
    } else {
      state.hasAcquiredAllShop = true
    }
  },
  setMessage(state, message) {
    state.message = message
  },
  setCurrentPositione(state, position) {
    state.lat = position.coords.latitude
    state.lng = position.coords.longitude
  },
  // 検索結果のお店の件数セット
  setShopCount(state, res) {
    state.shopCount = res.data.results.results_available
  }
}

export const actions = {
  getGenre (context) {
    this.$axios(process.env.apiUrl + '/api/genre/v1/', {
      //パラメータの設定
      params: {
        key: process.env.apiKey,
        format: 'json'
      }
    })
    .then(res => context.commit('setGenre', res)).catch(res => context.commit('setError'))
  },
  // 現在位置の取得
  getCurrentPosition (context) {
    navigator.geolocation.getCurrentPosition(
      position => context.commit('setCurrentPositione', position),
      error => context.commit('setMessage', '位置情報の取得に失敗しました。')
    )
  },
  // 検索結果の取得
  searchShop (context, number) {
    let requestParam = {
      key: process.env.apiKey,
      lat: context.state.lat,
      lng: context.state.lng,
      start: number,
      count: 30,
      format: 'json'
    }
    this.$axios.get(process.env.apiUrl + '/api/gourmet/v1/', {
      //パラメータの設定
      params: requestParam
    })
    .then(res => context.dispatch('successSearchShop', res))
    .catch(context.dispatch('failedSearchShop'))
  },
  // 検索結果の成功時
  successSearchShop (context, res) {
    context.commit('setShop', res)
    context.commit('setShopCount', res)
  },
  // 検索結果の成功時
  failedSearchShop (context, res) {
    context.commit('setMessage', '飲食店情報の取得に失敗しました。')
  }
}
