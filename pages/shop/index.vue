<template>
  <div class="container">
    <div class="title">
      <h1>現在地のお店一覧</h1>
      <p v-if="shopCount" class="shop-count"> {{shopCount}}件</p>
    </div>
    <div class="wrapper">
      <div class="grid" v-for="(shop, key) in shop" :key="key">
        <v-card class="card">
        <v-img
          :src="shop.photo.pc.l"
          height="300px"
        ></v-img>
          <v-card-text>{{shop.name}}</v-card-text>
        </v-card>
       </div>
    </div>
    <infinite-loading
      ref="infiniteLoading" 
      @infinite="infiniteHandler"
      spinner="spiral"
      v-if="displayLoad"
    >
      <div slot="no-results">条件に合うお店が見つかりませんでした</div>
      <!-- 下記を記述しないデフォルトの表示が出るため -->
      <div slot="no-more"/>
    </infinite-loading>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { mapGetters } from 'vuex'
export default {
  name: 'Shop',
  data() {
    return {
      start: 1,
      // 初期マウント時に子要素のdivの文言が出るのを防ぐため
      displayLoad: false
    }
  },
  computed: {
    shop () {
      return  this.$store.getters['shop/shops']
    },
    message () {
      return this.$store.getters['shop/message']
    },
    hasAcquiredAllShop () {
      return this.$store.getters['shop/hasAcquiredAllShop']
    },
    displayCount () {
      return 30
    },
    shopCount () {
      return this.$store.getters['shop/shopCount']
    },
  },
  mounted() {
    this.setDisplayLoad()
    this.$store.dispatch('shop/getCurrentPosition');
  },
  methods: {
    infiniteHandler() {
      setTimeout(() => {
        this.loadShop()
      }, 1000)
    },
    setDisplayLoad() {
      this.displayLoad = true
    },
    addStart() {
      this.start = this.start + this.displayCount
    },
    searchShop() {
      this.$store.dispatch('shop/searchShop', this.start);
    },
    loaded() {
      this.searchShop()
      this.addStart()
      this.$refs.infiniteLoading.stateChanger.loaded()
    },
    complete() {
      this.$refs.infiniteLoading.stateChanger.complete()
    },
    loadShop() {
      // 全件取得していたらスクロール停止させる
      if (this.hasAcquiredAllShop) {
        this.complete()
      } else {
        this.loaded()
      }
    },
    ...mapMutations({
      toggle: 'shop/toggle'
    })
  }
}
</script>
<style>
.container {
  max-width: 700px;
  margin: 0 auto;
}
.title {
  text-align: center;
}
.wrapper{
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin: 0 8px;
}

.grid {
  padding: 8px;
  width: 50%;
  border: none;
}

.card {
  height: 386px;
}

.message {
  display: block;
  font-size: 30px;
  text-align: center;
}
.shop-count {
 color: gray;
}
</style>