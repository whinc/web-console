<template>
  <div>
    <table>
      <thead>
        <th>Name</th>
        <th>Value</th>
      </thead>
      <tbody>
        <tr v-for="cookie in cookieList" :key="cookie.name">
          <td>{{cookie.name}}</td>
          <td>{{cookie.value}}</td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      // 数组元素数据结构: {name: string, value: any}
      cookieList: []
    };
  },
  mounted() {
    const cookie = document.cookie;
    if (cookie) {
      const kvList = cookie.split(/\s*;\s*/);
      const cookieList = kvList.map(v => {
        const arr = v.split("=");
        return {
          name: arr[0],
          value: arr[1]
        };
      });
      this.cookieList = cookieList;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
