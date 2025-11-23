<template>
  <Modal
    :show="visible"
    :close="handleClose"
    :title="title"
    :showFooter="false"
    :clickOutsideHide="true"
    :width="width"
  >
    <div class="video-wrapper">
      <video
        ref="videoEl"
        class="video-element"
        :src="src"
        controls
        autoplay
        playsinline
      ></video>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';

export default {
  name: 'VideoModal',
  components: { Modal },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '60vw',
    },
  },
  watch: {
    visible(val) {
      if (!val) {
        this.pause();
      } else {
        this.play();
      }
    },
    src() {
      // 源发生变化时重播
      this.$nextTick(() => {
        this.play();
      });
    },
  },
  methods: {
    handleClose() {
      this.$emit('close');
      this.pause();
    },
    play() {
      const el = this.$refs.videoEl;
      if (el && this.visible && this.src) {
        el.play().catch(() => {});
      }
    },
    pause() {
      const el = this.$refs.videoEl;
      if (el) {
        el.pause();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.video-wrapper {
  width: 100%;
  max-height: 80vh;
}

.video-element {
  width: 100%;
   
  max-height: 70vh;
  display: block;
  border-radius: 12px;
  background: #000;
  object-fit: contain;
}
</style>
