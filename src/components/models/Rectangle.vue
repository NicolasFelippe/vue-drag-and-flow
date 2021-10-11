<template>
  <div
    ref="node"
    :id="obj.id"
    :class="['node ', { selected: active }]"
    :style="`min-width: ${width}; min-height: ${height}; top: ${
      obj.x
    }px; left: ${obj.y}px; ${color ? 'background-color:' + color : ''}`"
    @click="$emit('select', obj)"
  >
    <div
      class="dot"
      :style="`background-color: ${
        topConnected ? '#1BA345' : '#ECF2F4'
      }; position: absolute; top: calc(-${sizeConnectors / 10}px - ${
        sizeConnectors / 2
      }px); left: calc(50% - ${
        sizeConnectors / 2
      }px); width: ${sizeConnectors}px; height: ${sizeConnectors}px; border-radius: 50px;`"
      :id="obj.id + 'top'"
      v-if="!start"
      @click="$emit('endLink', obj)"
      @drag="$emit('endLink', obj)"
    />

    <div v-if="!end && !condition">
      <div
        class="dot"
        :style="`background-color: ${
          bottomConnected ? '#1BA345' : '#ECF2F4'
        }; position: absolute; bottom: calc(-${sizeConnectors / 10}px - ${
          sizeConnectors / 2
        }px); left: calc(50% - ${
          sizeConnectors / 2
        }px); width: ${sizeConnectors}px; height: ${sizeConnectors}px; border-radius: 50px`"
        :id="obj.id + 'bottom'"
        @click="$emit('startLink', 'bottom', obj)"
      />
    </div>

    <div v-if="!end && condition">
      <div
        class="dot"
        :style="`background-color: ${
          obj.link ? '#1BA345' : '#1BA345'
        }; position: absolute; bottom: calc(-${sizeConnectors / 10}px - ${
          sizeConnectors / 2
        }px); left: calc(40% - ${
          sizeConnectors / 2
        }px); width: ${sizeConnectors}px; height: ${sizeConnectors}px; border-radius: 50px`"
        :id="obj.id + 'bottomYes'"
        @click="$emit('startLink', 'bottomYes', obj)"
      />
      <span
        style="position: absolute; left: 30px; bottom: -10px; color: #1ba345"
        >yes</span
      >
    </div>

    <div v-if="!end && condition">
      <div
        class="dot"
        :style="`background-color: ${
          obj.link ? '#1BA345' : '#DE3E44'
        }; position: absolute; bottom: calc(-${sizeConnectors / 10}px - ${
          sizeConnectors / 2
        }px); left: calc(60% - ${
          sizeConnectors / 2
        }px); width: ${sizeConnectors}px; height: ${sizeConnectors}px; border-radius: 50px`"
        :id="obj.id + 'bottomNo'"
        @click="$emit('startLink', 'bottomNo', obj)"
      />
      <span
        class="noAnimation"
        style="position: absolute; right: 35px; bottom: -10px; color: #de3e44"
        >no</span
      >
    </div>

    <div
      v-if="obj.icon && !iconOff"
      id="icon"
      :style="`background-color: ${backgroundColorIcon}; min-height: ${height}; width: 30px`"
    >
      <font-awesome-icon :icon="obj.icon" style="margin: 7px; width: 10px" />
    </div>
    <div id="content" v-if="obj.content">
      {{ obj.content }}
      <p style="font-size: 10px" v-if="obj.description">
        {{ obj.description }}
      </p>
    </div>
    <!-- <div
      id="status"
      :style="`background-color: ${statusColor} `"
      v-if="!obj.noStatus"
    ></div> -->
  </div>
</template>

<script>
export default {
  name: "Rectangle",
  props: {
    obj: {
      type: Object,
    },
    width: {
      type: String,
      default: "100px",
    },
    height: {
      type: String,
      default: "30px",
    },
    icon: {
      type: String,
      default: "icon",
    },
    backgroundColorIcon: {
      type: String,
      default: "#555",
    },
    topConnected: {
      type: Boolean,
    },
    bottomConnected: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    noStatus: {
      type: Boolean,
      default: false,
    },
    start: {
      type: Boolean,
      default: false,
    },
    end: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: Boolean,
      defalt: false,
    },
    group: {
      type: String,
    },
    color: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
    iconOff: {
      type: Boolean,
      default: false,
    },
    statusColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      sizeConnectors: 6,
    };
  },
};
</script>

<style scoped>
.node {
  width: 150px;
  height: 60px;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  cursor: move;
  background-color: #303030;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
}

.selected {
  box-shadow: rgba(255, 255, 255, 1) 0px 0px 5px;
  border: 1px rgb(47, 199, 103) solid;
  border-radius: 7px;
  /* transform: translate(-2px); */
}

.node > #content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
}

.node > #icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  vertical-align: center;
  margin: 0;
  align-items: center;
  border: 1px solid;
}

.node > #status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 5px;
  position: absolute;
  right: 0px;
  height: 100%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.dot {
  transition: all 0.1s ease-in-out;
}
.dot:hover {
  transform: scale(3);
  cursor: pointer;
}
</style>
