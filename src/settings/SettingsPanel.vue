<template>
  <div v-if="value" class="settings-panel">
    <div class="toolbar">
      <VIcon @click="onClickClose" name="close" style="" />
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
        <div class="title">{{activedConfig.desc}}</div>
        <div
          v-for="(setting, index) in activedConfig.settings || []"
          :key="index"
        >
          <template v-if="setting.type === 'section'">
            <div class="section">{{setting.desc}}</div>
          </template>
          <template v-else-if="setting.type === 'text'">
            <div class="text">{{setting.desc}}</div>
          </template>
          <template v-else-if="setting.type === 'checkbox'">
            <div class="checkbox">
              <input type="checkbox" v-model="setting.value" :id="index" @change="onSettingsChanged" />
              <label :for="index">{{setting.desc}}</label>
            </div>
          </template>
          <template v-else-if="setting.type === 'select'">
            <div class="select">
              <span>{{setting.desc}}</span>
              <select v-model="setting.value">
                <option disabled value="">请选择</option>
                <option
                  v-for="option in setting.options"
                  :key="option.name"
                  :value="option.value">
                  {{option.text}}
                </option>
              </select>
            </div>
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

const defaultConfigs = [
  {
    name: "console",
    desc: "Console",
    settings: [
      // {
      //   type: 'section',
      //   desc: 'Section1'
      // },
      // {
      //   type: 'text',
      //   desc: 'Section1',
      // },
      {
        type: "checkbox",
        name: "showTimestamps",
        value: false,
        desc: "show timestamps"
      }
      // {
      //   type: 'section',
      //   desc: 'Section1'
      // },
      // {
      //   type: 'checkbox',
      //   desc: 'show timestamp',
      //   value: false
      // },
      // {
      //   type: 'select',
      //   desc: 'select one',
      //   value: '',
      //   options: [
      //     {
      //       text: 'A',
      //       value: 1
      //     },
      //     {
      //       text: 'B',
      //       value: 2
      //     }
      //   ]
      // }
    ]
  },
  {
    desc: "About",
    settings: [
      {
        type: "section",
        desc: "Package name"
      },
      {
        type: "text",
        desc: process.env.VUE_APP_NAME
      },
      {
        type: "section",
        desc: "Version"
      },
      {
        type: "text",
        desc: process.env.VUE_APP_VERSION
      },
      {
        type: "section",
        desc: "Build date"
      },
      {
        type: "text",
        desc: process.env.VUE_APP_DATE
      }
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
       * name 用作存储时的 key
       * desc 显示在 UI 上的描述
       */
      configs: cloneDeep(defaultConfigs)
    };
  },
  computed: {
    activedConfig() {
      return this.configs[this.activedIndex];
    },
    settings() {}
  },
  watch: {
    value(val) {
      if (val) {
      }
    }
  },
  mounted() {
    // 启动时广播初始配置，后面配置变动时再次广播
    // logger.log('defaultConfigs:', defaultConfigs)
    this.loadSettings();
    // 触发一次 setting change 事件，通知其他组件做出相应的处理
    this.onSettingsChanged();
  },
  methods: {
    onSettingsChanged() {
      const settings = this.extractSettings(this.configs);
      eventBus.emit(eventBus.SETTINGS_CHANGE, settings);
      // logger.log('%o --extract--> %o --expand--> %o', this.configs, settings, this.expandSettings(settings))
      // logger.log("extractSettings:", settings);
    },
    onClickClose() {
      // v-model
      this.$emit("input", false);

      this.saveSettings();
    },
    saveSettings() {
      const settings = this.extractSettings(this.configs);
      window.localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    },
    loadSettings() {
      const content = window.localStorage.getItem(KEY_SETTINGS);
      if (!content) return;
      try {
        const settings = JSON.parse(content);
        this.expandSettings(settings);
      } catch (err) {
        logger.error(err);
      }
    },
    /**
     * 从 UI 配置中提取可修改的设置项
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
    extractSettings(configs) {
      const settings = {};
      this.configs.forEach(item => {
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
    // extractSettings 的逆过程：将设置项恢复到配置项中
    expandSettings(settings) {
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
      .section {
        font-size: 120%;
        color: #222;
        padding-top: 12px;
      }
      .text {
        padding-left: $margin-left;
        padding-top: 12px;
      }
      .checkbox {
        padding-left: $margin-left;
        padding-top: 12px;
        input {
          width: $primary-font-size;
          height: $primary-font-size;
        }
      }
      .select {
        padding-left: $margin-left;
        padding-top: 12px;
        select {
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
