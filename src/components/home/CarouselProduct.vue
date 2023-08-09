<template>
    <div>
        <div
        id="carouselExampleCaptions"
        class="relative"
        data-te-carousel-init
        data-te-carousel-slide>

        <!--Carousel items-->
        <div class="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
            <!--First item-->
            <div class="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms]
                ease-in-out motion-reduce:transition-none"
                data-te-carousel-item
                data-te-carousel-active
                style="backface-visibility: hidden">
                    <img :src="getImageUrl(imgs[0])"
                    class="block w-full"
                    alt="..." />
            </div>
            <!--Second item-->
            <div v-for="(image, index) in images" :key="image.name"
                class="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms]
                ease-in-out motion-reduce:transition-none"
                data-te-carousel-item
                style="backface-visibility: hidden">
                <img
                    :src="getImageUrl(image)"
                    class="block w-full"
                    alt="..." />
            </div>
        </div>

          <!--Carousel controls - prev item-->
          <button
          class="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
          type="button"
          data-te-target="#carouselExampleCaptions"
          data-te-slide="prev">
          <span class="inline-block h-8 w-8">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6">
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
          </span>
          <span
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Previous</span
          >
          </button>
          <!--Carousel controls - next item-->
          <button
          class="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
          type="button"
          data-te-target="#carouselExampleCaptions"
          data-te-slide="next">
          <span class="inline-block h-8 w-8">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6">
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
          </span>
          <span
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Next</span
          >
          </button>
  </div>
    </div>
  </template>
  <script>
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { Carousel, initTE } from "tw-elements";
import { useStore } from 'vuex';

   export default defineComponent({
        props: ['carousel_images'],
        setup(props) {
            const images = ref();
            const store  = useStore();
            var imgs = ref();
            imgs.value = props.carousel_images;
            //(imgs.value);
            onMounted(() => {
                initTE({ Carousel });
                images.value = imgs.value.filter((image, index) => {
                    if (index > 0) {
                        return image;
                    }
                });
            });

            watch(() => store.getters['product/product'], () => {
                imgs.value = store.getters['product/product'].images;
                images.value = imgs.value.filter((image, index) => {
                    if (index > 0) {
                        return image;
                    }
                });
                //(imgs.value[0]);
            })

            const getImageUrl = (image) => {
				return `data:${image.type};base64,${image.data}`;
			};

            return {
                getImageUrl, images, imgs
            }
        }
   })
  </script>

<style scoped>
    img {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
    }
</style>
