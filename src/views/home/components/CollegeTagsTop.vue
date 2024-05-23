<script lang="ts">
// 这是一个基于 TypeScript 的 Vue 组件
import { defineComponent, onMounted, ref, nextTick } from "vue";
import { register, getCollegeList } from "@/api/login";
import { CollegeMember } from "@/views/register/index.vue";

import PostTagTop from "./PostTagTop.vue";

import { getTagList } from "@/api/tag";

export type TagListMember = {
  id: string;
  belong: string;
  name: string;
};

export default defineComponent({
  emits: ["getCollegeTagNameChild"],
  components: { PostTagTop },
  setup(props, context) {
    // 在这里声明数据，或者编写函数并在这里执行它
    // 在使用 setup 的情况下，请牢记一点：不能再用 this 来获取 Vue 实例

    // dom
    const radiosTop = ref<HTMLElement[]>([]);
    const selectRadio = ref<string>("哈尔滨商业大学");

    // 高校名 + 高校代码
    const collegeList = ref<object[]>([]);
    const tagList = ref<TagListMember[]>([]); // 标签数据
    const tagListTotal = ref<TagListMember[]>([]); // 所有标签数据
    const testCollegeList = ref<CollegeMember[]>([
      {
        id: "1",
        name: "综合",
        code: "11111",
      },
      {
        id: "1627965942293053441",
        name: "哈尔滨商业大学",
        code: "10240",
      },
      {
        id: "1640264651585437697",
        name: "哈尔滨金融学院",
        code: "10245",
      },
      {
        id: "1640265176313839617",
        name: "黑龙江工程学院",
        code: "13304",
      },
      {
        id: "1640265378022113282",
        name: "齐齐哈尔大学",
        code: "10232",
      },
      {
        id: "1640265023729254401",
        name: "黑河学院",
        code: "13744",
      },
    ]);
    // 生命周期钩子
    onMounted(() => {
      getTagListInfo();
      // getCollegeListInfo();
      // handleClick(
      //   {
      //     id: "1627965942293053441",
      //     name: "哈尔滨商业大学",
      //     code: "10240",
      //   },
      //   2
      // );
    });

    // 方法 methods
    const getCollegeListInfo = async () => {
      const { data } = await getCollegeList();
      collegeList.value = data;
    };

    const getTagListInfo = async () => {
      const result = await getTagList();
      const data: TagListMember[] = result.data;
      // 过滤
      tagListTotal.value = data;
      // console.log(tagListTotal.value)
      // 更新二级标签数据
      tagList.value = tagListTotal.value.filter((current) => {
        return current.belong === selectRadio.value;
      });
      // console.log(tagList.value);
    };

    const handleClick = (currentItem: CollegeMember, index: number) => {
      // 单击函数
      // console.log(currentItem);
      // console.log(emits);
      // emits("getCollegeTagNameChild", currentItem);
      context.emit("getCollegeTagNameChild", currentItem.name);
      selectRadio.value = currentItem.name;
      // 更新二级标签数据
      tagList.value = tagListTotal.value.filter((current) => {
        return current.belong === selectRadio.value;
      });
    };

    // 计算方法 computed

    // 监听 watch

    return {
      // 需要给 `<template />` 用的数据或函数，在这里 `return` 出去
      tagList,
      collegeList,
      testCollegeList,
      radiosTop,
      selectRadio,

      handleClick,
    };
  },
});
</script>

<template>
  <div class="tags-container">
    <div class="radios-top-inputs">
      <label
        class="radios-top"
        ref="radiosTop"
        v-for="(collegeItem, index) in testCollegeList"
        :key="collegeItem.code"
      >
        <input
          type="radio"
          name="radio"
          :value="collegeItem.name"
          v-model="selectRadio"
          @click="handleClick(collegeItem, index)"
        />
        <span class="name">{{ collegeItem.name }}</span>
      </label>
    </div>
    <PostTagTop v-if="tagList.length !== 0" :tagList="tagList" />
  </div>
</template>

<style lang="scss">
// <= 991
@media screen and (max-width: 991px) {
  .tags-container {
    .radios-top-inputs {
      justify-content: start;
    }
  }

  // 字体缩小
  .tags-container .radios-top-inputs .radios-top .name {
    // 补充
    font-size: 14px;
    // padding: 4px 12px;
    color: #515767;
  }
}

.tags-container {
  display: flex;
  flex-direction: column;
  margin-top: 60px;
}

.radios-top-inputs {
  // 补充
  // margin: 0 auto;
  // width: 120px;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: center;
}

.radios-top-inputs {
  position: relative;
  display: flex;
  // flex-wrap: wrap;
  // border-radius: 0.5rem;
  // background-color: #eee;
  // width: 300px;
  border-radius: 0.2rem;
  background-color: #f9fbff;
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  font-size: 14px;
}

.radios-top-inputs .radios-top {
  // flex: 1 1 auto;
  text-align: center;
}

.radios-top {
  position: relative;
  // 下面为补充
  flex-shrink: 0;
}

.radios-top-inputs .radios-top input {
  display: none;
}

.radios-top-inputs .radios-top .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  // border-radius: 0.5rem;
  border-radius: 0.2rem;
  border: none;
  // padding: 0.5rem 0;
  padding: 8px 17px;
  // color: rgba(51, 65, 85, 1);
  transition: all 0.15s ease-in-out;
}

.name {
  // 补充
  font-size: 18px;
  color: #515767;
}

.radios-top-inputs .radios-top input:hover + .name {
  // background-color: #fff;
  background-color: #e9ecef;
  color: #409eff;
}

.radios-top-inputs .radios-top input:checked + .name {
  // background-color: #fff;
  background-color: #eaf2ff;
  color: #409eff;
  font-weight: 600;
}

// 判断radio下是否存在input:checked, 有则添加::after | 相当于选中选中父元素的效果
.radios-top:has(input:checked) {
  ::after {
    content: "";
    position: absolute;
    transform: translateX(-50%);
    // top:50%;
    bottom: 0;
    // right: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #409eff;
  }
}
</style>
