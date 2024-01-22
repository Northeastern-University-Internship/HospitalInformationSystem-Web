<template>
  <div class="page-container">
    <!-- Carousel at the top of the page -->
    <div class="carousel-container">
      <User></User>
    </div>

    <el-container class="main-content">
      <!-- Add main content here -->
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
  flex: 0 0 auto; /* Do not grow or shrink */
}

.main-content {
  flex: 1; /* Grow to fill available space */
  overflow-y: auto; /* Add scroll if content overflows */
}

.footer {
  flex: 0 0 auto; /* Do not grow or shrink */
  background-color: #f2f2f2; /* Footer background color */
  padding: 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Add shadow to the top of the footer */
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
  flex: 1; /* Distribute space evenly */
}


</style>