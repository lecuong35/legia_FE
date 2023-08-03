<template>
    <div class="w-full relative">
        <input type="text" @input="$emit('update:value', $event.target.value)"
        :class="placeholder" :value="value"
        class="w-full outline-none focus:shadow-md
        border-solid border-[1px] border-[#f0f0f1]
        text-[#000] font-thin leading-[24px]
        mobile:h-[40px] mobile:text-lg"
        @blur="focus(placeholder)" @click="clickLabel(placeholder)">
        <div class="label absolute mt-[-28px] ml-[10px] bg-[#fff] z-9" :id="placeholder">
            <p class="placeholder text-[#000] text-sm opacity-50" @click="clickLabel(placeholder)">{{placeholder}}</p>
        </div>
    </div>
</template>

<script>
    import { ref, defineComponent, onMounted } from 'vue';

    export default defineComponent({
        props: ['placeholder', 'value'],
        setup(props) {
            const name = ref('');

            const focus = (placeholder) => {
                const input = document.getElementsByClassName(placeholder)[0];
                const label = document.getElementById(placeholder);

                if (input.value != '') {
                    label.style.translate = "0px -22px";
                }
                else {
                    label.style.translate = "0px 0px";
                }
            }

            onMounted(() => {
                const input = document.getElementsByClassName(props.placeholder)[0];
                const label = document.getElementById(props.placeholder);

                if (input.value != '') {
                    label.style.translate = "0px -22px";
                }
                else {
                    label.style.translate = "0px 0px";
                }
            })

            const clickLabel = (placeholder) => {
                const label = document.getElementById(placeholder);
                const input = document.getElementsByClassName(placeholder)[0];
                label.style.translate = "0px -22px";
                input.focus();
            }

            return {
                name, focus, clickLabel
            }
        }
    })

</script>

<style scoped>
    input {
        padding: 5px 10px;
        border-radius: 5px;
    }

    input:focus ~ .label {
        translate: 0px -22px
    }
</style>
