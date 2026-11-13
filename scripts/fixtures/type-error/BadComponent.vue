<template>
  <span>{{ double(2) }}</span>
</template>

<script setup lang="ts">
// 型エラーを検出できるかを確かめるための、意図的に間違えたファイルです。
const double = (value: number) => value * 2;
double('2');
</script>
