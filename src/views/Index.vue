<template>
  <div class="page-container">
    <div class="carousel-container">
      <User></User>
    </div>

    <el-container class="main-content">
    </el-container>

    <div class="footer">
      <div class="chart-container">
        <Rotation></Rotation>
      </div>
    </div>
  </div>
</template>

<script>
import User from '../components/user'
import Clock from "../components/clock";
import NumberCard from "../components/NumberCard";
import Columnar from "../components/Columnar";
import PieChart from "../components/PieChart";
import Rotation from "../components/Rotation";

export default {
  name: "Index",

  components: {
    Clock,
    User,
    NumberCard,
    Columnar,
    PieChart,
    Rotation
  },

  data() {
    return {}
  }
}
</script>

<style scoped>
.myCard{
  margin-left: 10px;
  margin-bottom: 10px;
}
.el-card {
  width: auto;
} 
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.carousel-container {
  flex: 0 0 auto; 
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.footer {
  flex: 0 0 auto; 
  background-color: #f2f2f2;
  padding: 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.number-cards {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 20px;
}

.clock {
  align-self: center;
}

.chart-container {
  display: flex;
  justify-content: space-around;
}

.myCard {
  margin: 0 10px;
  flex: 1; 
}


</style>