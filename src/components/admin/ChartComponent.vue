<template>
  <div class="grid w-full p-[10px] border rounded-lg
  xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 mobile:grid-cols-1">
    <div class="search">
      <p class="section_title text-[20px] font-bold">
        Tổng Quan
      </p>
      <div class="pr-[10px] pt-[10px]">
        <div class="over_view_section">
          <p>
            Doanh thu tháng này:
            <span>
              {{
                Math.round(data_chart[this_month]*1000) / 1000
              }} triệu đồng
            </span>
          </p>
        </div>
       <div class="over_view_section">
          <p>
            Đơn hàng chưa xác nhận:
            <span>
              {{ pending_orders.length }}
            </span>
          </p>
       </div>
        <div class="over_view_section">
          <p>
            Số đơn đã xác nhận tháng này:
            <span>
              {{ done_orders }}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="xl:border-l lg:border-l md:border-l sm:border-t mobile:border-t
    xl:pl-[10px] lg:pl-[10px] md:pl-[10px] sm:pt-[10px] mobile:pt-[10px]">
      <div class="flex items-center justify-between">
        <p class="section_title text-[20px] font-bold">
          Doanh Thu
        </p>
        <div>
          <select v-model="year" class="px-[10px] py-[5px]">
            <option disabled value="">Chọn năm để xem thống kê</option>
            <option v-for="y in year_array">{{ y }}</option>
          </select>
        </div>
      </div>
      <Bar
        v-if="loaded"
        :options="chartOptions"
        :data="chartData"
        :id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref, unref, watch } from 'vue'
import { useStore } from 'vuex'
import { Select, initTE } from "tw-elements";
initTE({ Select });

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },

  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'labels'
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 300
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },

  setup() {
    const store = useStore();
    const data_chart = ref(new Array(12).fill(0));
    const this_month = (new Date()).getMonth();
    const this_year = (new Date()).getFullYear();
    const loaded = ref(false);
    const pending_orders = ref([]);
    const done_orders = ref(0);
    const year = ref(this_year);
    var year_array = new Array(this_year - 2016).fill(this_year);

    year_array = year_array.map((y, index) => {
      return this_year - index
    });

    const fetch_data = async (year_to_show) => {
      try {
        await store.dispatch('bill/getBills', ['null', 1, 'all']);
        var response = store.getters['bill/all_bills'];
        console.log(response);
        response = Object.entries(response);
        data_chart.value.fill(0);
        response.map(bill => {
          const date = new Date(bill[1].updated_at);
          const index  = date.getMonth();

          if(date.getFullYear() == year_to_show) {
            if ( bill[1].status == 'DONE') {
              data_chart.value[index] += bill[1].total / 10e5;
              if (index == this_month){
                done_orders.value += 1;
            }
          }
            else{
              data_chart.value[index] += 0;
            }
          }

          if (bill[1].status == 'PENDING') {
            pending_orders.value.push(bill);
          }
        });
        chartData.datasets[0].data = [...data_chart.value];
        console.log(chartData.datasets[0].data);
        loaded.value = true;

      } catch (error) {
        console.log(error);
      }
    };
    fetch_data(year.value);

    const chartData = reactive({
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6',
       'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          backgroundColor: ['#cce9e4', 'red', 'green'] ,
          data: data_chart.value,
          label: 'Doanh thu - triệu đồng'
        }
      ]
    });
    const chartOptions = reactive({
      responsive: true,
    });
    // const rerender = async () => {
    //   loaded.value = false;
    //   fetch_data();
    // }

    watch(year, () => {
      loaded.value = false;
      fetch_data(year.value);
    })
    return {
      chartData, chartOptions, data_chart, loaded, this_month,
      pending_orders, done_orders, year, year_array,
    }
  }

}
</script>
<style>
.section_title {
  background: -webkit-linear-gradient(270deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

select {
  padding: 5px 10px;
}
</style>
