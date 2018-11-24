<template>
  <div v-if="value" class="settings-panel">
    <div class="toolbar">
      <VIcon @click="onClickClose" name="close" style="width: 20px" />
    </div>
    <div class="main">
      <!-- 侧边栏 -->
      <div class="side">
        <div class="title">Settings</div>
        <div
          v-for="(cfg, index) in configs"
          :key="cfg.title"
          @click="activedIndex = index"
          :class="{selected: activedIndex === index}"
          class="item"
          >
          <span>{{cfg.desc}}</span>
        </div>
      </div>
      <!-- 设置选项 -->
      <div class="content">
        <div
          v-for="(setting, index) in activedConfig.settings || []"
          :key="index"
          :class="setting.type"
        >
          <template v-if="setting.type === 'section'">
            <div class="section">{{setting.desc}}</div>
          </template>
          <template v-else-if="setting.type === 'title'">
            <span>{{setting.desc}}</span>
          </template>
          <template v-else-if="setting.type === 'separator'">
            <!-- empty div with height -->
          </template>
          <template v-else-if="setting.type === 'text'">
            <div class="text">{{setting.desc}}</div>
          </template>
          <template v-else-if="setting.type === 'checkbox'">
            <input type="checkbox" v-model="setting.value" :id="index" @change="onSettingsChanged" />
            <label :for="index">{{setting.desc}}</label>
          </template>
          <template v-else-if="setting.type === 'select'">
            <span>{{setting.desc}}</span>
            <select v-model="setting.value" @change="onSettingsChanged">
              <option disabled value="">请选择</option>
              <option
                v-for="option in setting.options"
                :key="option.name"
                :value="option.value">
                {{option.text}}
              </option>
            </select>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VIcon } from "../components";
import { eventBus, Logger, cloneDeep } from "@/utils";

const logger = new Logger("[SettingsPanel]");
const KEY_SETTINGS = "web-console:settings";

/**
 * 默认配置
 * name 作为存储时的键
 * desc 作为显示的描述文案
 * settings 是子项
 *  type 是 UI 类型
 */
const defaultConfigs = [
  {
    name: "console",
    desc: "Console",
    settings: [
      { type: "title", desc: "Console" },
      {
        type: "checkbox",
        name: "showTimestamps",
        value: false,
        desc: "Show timestamps"
      },
      { type: "separator" },
      {
        type: "select",
        name: "maxMsgCount",
        value: 400,
        desc: "Max message count: ",
        options: [
          { text: "400", value: 400 },
          { text: "800", value: 800 },
          { text: "1600", value: 1600 },
          { text: "Infinity", value: Number.MAX_VALUE }
        ]
      }
    ]
  },
  {
    desc: "About",
    settings: [
      { type: "title", desc: "About" },
      { type: "section", desc: "Package name" },
      { type: "text", desc: process.env.VUE_APP_NAME },
      { type: "separator" },
      { type: "section", desc: "Version" },
      { type: "text", desc: process.env.VUE_APP_VERSION },
      { type: "separator" },
      { type: "section", desc: "Build date" },
      { type: "text", desc: process.env.VUE_APP_DATE }
    ]
  }
];

export default {
  name: "SettingsPanel",
  components: {
    VIcon
  },
  props: {
    // v-model
    value: Boolean
  },
  data() {
    return {
      activedIndex: 0,
      /**
       * settings 的 UI 配置
       */
      configs: cloneDeep(defaultConfigs)
    };
  },
  computed: {
    activedConfig() {
      return this.configs[this.activedIndex];
    }
  },
  // watch: {
  //   value(val) {
  //     if (val) {
  //     }
  //   }
  // },
  mounted() {
    // 加载配置
    this.loadSettings();
    // 通知配置更新
    this.onSettingsChanged();
  },
  methods: {
    // 通知配置更新
    onSettingsChanged() {
      const settings = this.configs2Settings(this.configs);
      eventBus.emit(eventBus.SETTINGS_CHANGE, settings);
      // logger.log('%o --extract--> %o --expand--> %o', this.configs, settings, this.settings2Configs(settings))
      // logger.log("configs2Settings:", settings);
    },
    onClickClose() {
      // v-model
      this.$emit("input", false);

      this.saveSettings();
    },
    saveSettings() {
      const settings = this.configs2Settings(this.configs);
      window.localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    },
    loadSettings() {
      const content = window.localStorage.getItem(KEY_SETTINGS);
      if (!content) return;
      try {
        const settings = JSON.parse(content);
        this.settings2Configs(settings);
      } catch (err) {
        logger.error(err);
      }
    },
    /**
     * 将配置项转为设置项，前者除了包含设置项还包含与 UI 相关的数据，后者指
     * [
     *  {
     *    name: 'aa',
     *    setting: [
     *      {
     *        name: 'bb',
     *        value: 'cc'
     *      }
     *    ]
     *  }
     * ]
     *
     * 提取设置：
     * {
     *  'aa': {
     *    'bb': 'cc'
     *  }
     * }
     */
    configs2Settings(configs) {
      const settings = {};
      configs.forEach(item => {
        if (!item.name) return;
        const name1 = item.name;
        settings[name1] = {};
        item.settings.forEach(item2 => {
          if (!item2.name) return;
          const name2 = item2.name;
          settings[name1][name2] = item2.value;
        });
      });
      return settings;
    },
    // configs2Settings 的逆过程：将设置项恢复到配置项中
    settings2Configs(settings) {
      const configs = this.configs;
      Object.keys(settings).forEach(name1 => {
        const config = configs.find(item => item.name === name1);
        if (!config) return;
        Object.keys(settings[name1]).forEach(name2 => {
          const config2 = config.settings.find(item2 => item2.name === name2);
          if (!config2) return;
          config2.value = settings[name1][name2];
        });
      });
      return configs;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../base.scss";
$primary-text-color: rgb(48, 57, 66);
$second-text-color: #777;
.settings-panel {
  $gap: 4px;
  position: absolute;
  top: $gap;
  left: $gap;
  bottom: $gap;
  right: $gap;
  background-color: white;
  box-shadow: 0 0 0.61538462em rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  .toolbar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 5px;
  }
  .main {
    display: flex;
    flex-direction: row;
    .side {
      flex: 0 0 30vw;
      display: flex;
      flex-direction: column;
      .title {
        font-size: $primary-font-size * 1.5;
        color: $primary-text-color;
        white-space: nowrap;
        padding: 0 0 10px 10px;
      }
      .item {
        font-size: $primary-font-size;
        flex: 0 0 $primary-font-size * 2;
        padding: 4px 5px;
        color: $second-text-color;
        border-left: 6px solid #ffff;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &.selected {
          color: $primary-text-color;
          border-left: 6px solid #666;
        }
      }
    }
    .content {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      $margin-left: 15px;
      .title {
        font-size: $primary-font-size * 1.5;
        color: $primary-text-color;
        white-space: nowrap;
        padding-bottom: 6px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eeeeee;
      }
      .separator {
        height: 12px;
      }
      .section {
        font-size: 110%;
        color: #222;
      }
      .text {
        padding-left: $margin-left;
      }
      .checkbox {
        padding-left: $margin-left;
        display: flex;
        align-items: center;
        input {
          width: $primary-font-size;
          height: $primary-font-size;
        }
      }
      .select {
        padding-left: $margin-left;
        display: flex;
        align-items: center;
        select {
          background-color: transparent;
          border: 1px solid rgba(0, 0, 0, 0.2);
          color: #333;
          border-radius: 2px;
          padding: 0 5px;
          margin: 0 0 0 10px;
        }
      }
    }
  }
}
</style>
