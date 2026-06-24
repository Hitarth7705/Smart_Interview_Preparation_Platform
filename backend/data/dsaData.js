const dsaQuestions = [
  // ── Arrays ──────────────────────────────────────────────────
  {
    dsaNumber: 1,
    title: "Two Sum",
    problem:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may not use the same element twice.",
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    approach:
      "Use a hash map to store each number's index as you iterate. For every element, check if its complement (target - element) is already in the map. This gives O(n) time instead of O(n²) brute force.",
    topic: "Arrays",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["hash map", "array", "classic"],
  },
  {
    dsaNumber: 2,
    title: "Maximum Subarray (Kadane's Algorithm)",
    problem:
      "Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.",
    solution: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    maxSum = Math.max(maxSum, current);
  }
  return maxSum;
}`,
    approach:
      "Kadane's Algorithm: maintain a running sum. At each element, decide whether to extend the previous subarray or start fresh. Update the global max at every step.",
    topic: "Arrays",
    difficulty: "Medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["dynamic programming", "greedy", "subarray"],
  },
  {
    dsaNumber: 3,
    title: "Best Time to Buy and Sell Stock",
    problem:
      "Given an array `prices` where `prices[i]` is the stock price on day i, find the maximum profit from a single buy-sell transaction. Return 0 if no profit is possible.",
    solution: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) minPrice = price;
    else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
  }
  return maxProfit;
}`,
    approach:
      "Track the minimum price seen so far. At each step, compute profit if we sold today, and update the max profit. Single pass, O(n).",
    topic: "Arrays",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["greedy", "array", "stocks"],
  },

  // ── Strings ────────────────────────────────────────────────
  {
    dsaNumber: 4,
    title: "Valid Anagram",
    problem:
      "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
    approach:
      "Count character frequencies of `s` using a hash map, then decrement for each character in `t`. If any count goes below 0 or a character is missing, return false.",
    topic: "Strings",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["hash map", "string", "frequency"],
  },
  {
    dsaNumber: 5,
    title: "Longest Substring Without Repeating Characters",
    problem:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    solution: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) { set.delete(s[left]); left++; }
    set.add(s[right]);
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    approach:
      "Sliding window with a Set. Expand right pointer; when a duplicate is found, shrink from the left until the duplicate is removed. Track the maximum window size.",
    topic: "Strings",
    difficulty: "Medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n,m))",
    tags: ["sliding window", "set", "string"],
  },

  // ── Linked Lists ───────────────────────────────────────────
  {
    dsaNumber: 6,
    title: "Reverse a Linked List",
    problem:
      "Given the head of a singly linked list, reverse the list and return the reversed list's head.",
    solution: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    approach:
      "Iterative three-pointer approach: keep track of `prev`, `curr`, and `next`. At each step, reverse the current node's pointer, then advance all three pointers forward.",
    topic: "Linked Lists",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["linked list", "iterative", "pointers"],
  },
  {
    dsaNumber: 7,
    title: "Detect Cycle in Linked List",
    problem:
      "Given the head of a linked list, determine if the linked list has a cycle in it.",
    solution: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    approach:
      "Floyd's Tortoise and Hare: use two pointers — slow moves one step, fast moves two steps. If there's a cycle, they will eventually meet. If fast reaches null, there's no cycle.",
    topic: "Linked Lists",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["two pointers", "linked list", "Floyd's"],
  },

  // ── Stacks & Queues ────────────────────────────────────────
  {
    dsaNumber: 8,
    title: "Valid Parentheses",
    problem:
      "Given a string `s` containing just `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid. An open bracket must be closed by the same type of bracket in the correct order.",
    solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
    approach:
      "Use a stack. Push opening brackets. For every closing bracket, check if the top of the stack matches. At the end, the stack must be empty.",
    topic: "Stacks & Queues",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["stack", "string", "brackets"],
  },

  // ── Trees ──────────────────────────────────────────────────
  {
    dsaNumber: 9,
    title: "Maximum Depth of Binary Tree",
    problem:
      "Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from root to the farthest leaf.",
    solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    approach:
      "Recursive DFS: the depth of a node is 1 plus the maximum depth of its two subtrees. Base case: null node has depth 0.",
    topic: "Trees",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) — h is tree height",
    tags: ["recursion", "DFS", "binary tree"],
  },
  {
    dsaNumber: 10,
    title: "Validate Binary Search Tree",
    problem:
      "Given the root of a binary tree, determine if it is a valid BST. A valid BST has all left descendants less than the node, and all right descendants greater.",
    solution: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
}`,
    approach:
      "Pass valid range [min, max] to each recursive call. Left subtree must be < current value; right subtree must be > current value. Update bounds at each level.",
    topic: "Trees",
    difficulty: "Medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    tags: ["BST", "recursion", "tree validation"],
  },

  // ── Graphs ─────────────────────────────────────────────────
  {
    dsaNumber: 11,
    title: "Number of Islands",
    problem:
      "Given an m×n grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    solution: `function numIslands(grid) {
  let count = 0;
  const dfs = (r, c) => {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0'; // mark visited
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { dfs(r, c); count++; }
  return count;
}`,
    approach:
      "DFS flood fill: whenever a '1' is found, increment count and DFS to mark all connected '1's as visited (set to '0'). Count equals the number of DFS calls from the outer loop.",
    topic: "Graphs",
    difficulty: "Medium",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(m×n)",
    tags: ["DFS", "BFS", "graph", "grid"],
  },

  // ── Dynamic Programming ────────────────────────────────────
  {
    dsaNumber: 12,
    title: "Climbing Stairs",
    problem:
      "You can climb 1 or 2 steps at a time. Given n steps, how many distinct ways can you reach the top?",
    solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    approach:
      "Classic DP — it's Fibonacci: ways(n) = ways(n-1) + ways(n-2). Use two variables instead of an array to achieve O(1) space.",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["fibonacci", "DP", "bottom-up"],
  },
  {
    dsaNumber: 13,
    title: "Coin Change",
    problem:
      "Given an array of coin denominations and a target amount, return the fewest number of coins needed to make that amount. Return -1 if it's impossible.",
    solution: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++)
    for (const coin of coins)
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    approach:
      "Bottom-up DP: dp[i] = min coins to make amount i. For each amount, try every coin and take the minimum. Build up from 0 to the target.",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    timeComplexity: "O(amount × coins)",
    spaceComplexity: "O(amount)",
    tags: ["DP", "BFS", "optimization"],
  },

  // ── Sorting & Searching ────────────────────────────────────
  {
    dsaNumber: 14,
    title: "Binary Search",
    problem:
      "Given a sorted array of integers and a target value, return the index of the target. If not found, return -1.",
    solution: `function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    approach:
      "Repeatedly halve the search space. Compare the middle element to the target; eliminate the half that can't contain the target. Loop until found or space is empty.",
    topic: "Sorting & Searching",
    difficulty: "Easy",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    tags: ["binary search", "sorted array", "divide and conquer"],
  },

  // ── Two Pointers ───────────────────────────────────────────
  {
    dsaNumber: 15,
    title: "3Sum",
    problem:
      "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i ≠ j ≠ k and nums[i] + nums[j] + nums[k] === 0. No duplicate triplets.",
    solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left+1]) left++;
        while (left < right && nums[right] === nums[right-1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
    approach:
      "Sort the array. Fix one element (i), then use two pointers (left, right) to find pairs that sum to -nums[i]. Skip duplicates at every step to avoid repeated triplets.",
    topic: "Two Pointers",
    difficulty: "Medium",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    tags: ["two pointers", "sorting", "array"],
  },

  // ── Sliding Window ─────────────────────────────────────────
  {
    dsaNumber: 16,
    title: "Maximum Average Subarray",
    problem:
      "Given an integer array `nums` and integer `k`, find the contiguous subarray of length `k` that has the maximum average and return that average.",
    solution: `function findMaxAverage(nums, k) {
  let sum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let max = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    max = Math.max(max, sum);
  }
  return max / k;
}`,
    approach:
      "Fixed-size sliding window: compute initial window sum, then slide by adding the new element and removing the leftmost one. Track the maximum window sum.",
    topic: "Sliding Window",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["sliding window", "array", "average"],
  },

  // ── Hashing ────────────────────────────────────────────────
  {
    dsaNumber: 17,
    title: "Group Anagrams",
    problem:
      "Given an array of strings `strs`, group the anagrams together and return them as a list of groups.",
    solution: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}`,
    approach:
      "Anagrams produce the same sorted string. Use a hash map where keys are sorted strings and values are lists of original strings that produce that key.",
    topic: "Hashing",
    difficulty: "Medium",
    timeComplexity: "O(n·k·log k) — k is max string length",
    spaceComplexity: "O(n·k)",
    tags: ["hash map", "sorting", "string"],
  },

  // ── Recursion ──────────────────────────────────────────────
  {
    dsaNumber: 18,
    title: "Subsets (Power Set)",
    problem:
      "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    solution: `function subsets(nums) {
  const result = [[]];
  for (const num of nums)
    result.push(...result.map(sub => [...sub, num]));
  return result;
}`,
    approach:
      "Iterative bit-mask approach: start with an empty subset. For each number, duplicate all existing subsets and append the new number to each duplicate.",
    topic: "Recursion",
    difficulty: "Medium",
    timeComplexity: "O(2^n)",
    spaceComplexity: "O(2^n)",
    tags: ["backtracking", "recursion", "bit manipulation"],
  },

  // ── Backtracking ───────────────────────────────────────────
  {
    dsaNumber: 19,
    title: "Permutations",
    problem:
      "Given an array `nums` of distinct integers, return all possible permutations.",
    solution: `function permute(nums) {
  const result = [];
  const bt = (path, remaining) => {
    if (!remaining.length) { result.push(path); return; }
    for (let i = 0; i < remaining.length; i++)
      bt([...path, remaining[i]], [...remaining.slice(0,i), ...remaining.slice(i+1)]);
  };
  bt([], nums);
  return result;
}`,
    approach:
      "Backtracking: at each step, pick one element from the remaining pool, add it to the current path, and recurse on the rest. Backtrack by trying the next element.",
    topic: "Backtracking",
    difficulty: "Medium",
    timeComplexity: "O(n × n!)",
    spaceComplexity: "O(n!)",
    tags: ["backtracking", "recursion", "permutation"],
  },

  // ── Greedy ────────────────────────────────────────────────
  {
    dsaNumber: 20,
    title: "Jump Game",
    problem:
      "Given an array `nums` where each element represents your maximum jump length at that position, return true if you can reach the last index starting from index 0.",
    solution: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
    approach:
      "Greedy: track the farthest index reachable so far. At each index, if the current index exceeds maxReach, it's unreachable — return false. Otherwise update maxReach.",
    topic: "Greedy",
    difficulty: "Medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["greedy", "array", "jump"],
  },

// ── Heaps ───────────────────────────────────────────────────
// ── Arrays ────────────────────────────────────────────────
{
  dsaNumber: 21,
  title: "Product of Array Except Self",
  problem: "Given an integer array nums, return an array answer such that answer[i] is the product of all elements except nums[i].",
  solution: `function productExceptSelf(nums) {
    const n = nums.length;
    const res = Array(n).fill(1);
    let prefix = 1, suffix = 1;
    for (let i = 0; i < n; i++) {
      res[i] = prefix;
      prefix *= nums[i];
    }
    for (let i = n - 1; i >= 0; i--) {
      res[i] *= suffix;
      suffix *= nums[i];
    }
    return res;
  }`,
  approach: "Use prefix and suffix products to avoid division. Two passes give O(n) time and O(1) extra space.",
  topic: "Arrays",
  difficulty: "Medium",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  tags: ["array", "prefix", "suffix"],
},

{
  dsaNumber: 22,
  title: "Merge Intervals",
  problem: "Given an array of intervals, merge all overlapping intervals.",
  solution: `function merge(intervals) {
    intervals.sort((a,b)=>a[0]-b[0]);
    const res=[intervals[0]];
    for (let i=1;i<intervals.length;i++) {
      const last=res[res.length-1];
      if (intervals[i][0]<=last[1]) last[1]=Math.max(last[1],intervals[i][1]);
      else res.push(intervals[i]);
    }
    return res;
  }`,
  approach: "Sort by start time, then merge overlapping intervals greedily.",
  topic: "Arrays",
  difficulty: "Medium",
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  tags: ["array", "intervals", "sorting"],
},

// ── Strings ───────────────────────────────────────────────
{
  dsaNumber: 23,
  title: "Palindrome Partitioning",
  problem: "Partition a string into all possible palindrome substrings.",
  solution: `function partition(s) {
    const res=[], path=[];
    const isPal=(str,l,r)=>{
      while(l<r) if(str[l++]!==str[r--]) return false;
      return true;
    };
    const backtrack=(start)=>{
      if(start===s.length){res.push([...path]);return;}
      for(let end=start;end<s.length;end++){
        if(isPal(s,start,end)){
          path.push(s.slice(start,end+1));
          backtrack(end+1);
          path.pop();
        }
      }
    };
    backtrack(0);
    return res;
  }`,
  approach: "Backtracking with palindrome check at each step.",
  topic: "Strings",
  difficulty: "Medium",
  timeComplexity: "O(n·2^n)",
  spaceComplexity: "O(n)",
  tags: ["string", "backtracking", "palindrome"],
},

{
  dsaNumber: 24,
  title: "Longest Palindromic Substring",
  problem: "Given a string s, return the longest palindromic substring.",
  solution: `function longestPalindrome(s) {
    let res="";
    const expand=(l,r)=>{
      while(l>=0 && r<s.length && s[l]===s[r]){
        if(r-l+1>res.length) res=s.slice(l,r+1);
        l--;r++;
      }
    };
    for(let i=0;i<s.length;i++){
      expand(i,i);
      expand(i,i+1);
    }
    return res;
  }`,
  approach: "Expand around center for each index.",
  topic: "Strings",
  difficulty: "Medium",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  tags: ["string", "palindrome", "two pointers"],
},

// ── Linked Lists ──────────────────────────────────────────
{
  dsaNumber: 25,
  title: "Merge Two Sorted Lists",
  problem: "Merge two sorted linked lists and return as a new sorted list.",
  solution: `function mergeTwoLists(l1,l2){
    const dummy={next:null}; let curr=dummy;
    while(l1 && l2){
      if(l1.val<l2.val){curr.next=l1;l1=l1.next;}
      else{curr.next=l2;l2=l2.next;}
      curr=curr.next;
    }
    curr.next=l1||l2;
    return dummy.next;
  }`,
  approach: "Iteratively merge nodes by comparing heads.",
  topic: "Linked Lists",
  difficulty: "Easy",
  timeComplexity: "O(n+m)",
  spaceComplexity: "O(1)",
  tags: ["linked list", "merge"],
},

{
  dsaNumber: 26,
  title: "Remove Nth Node From End",
  problem: "Remove the nth node from the end of a linked list.",
  solution: `function removeNthFromEnd(head,n){
    const dummy={next:head}; let slow=dummy,fast=dummy;
    for(let i=0;i<=n;i++) fast=fast.next;
    while(fast){slow=slow.next;fast=fast.next;}
    slow.next=slow.next.next;
    return dummy.next;
  }`,
  approach: "Two-pointer technique with dummy node.",
  topic: "Linked Lists",
  difficulty: "Medium",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  tags: ["linked list", "two pointers"],
},

// ── Stacks & Queues ───────────────────────────────────────
{
  dsaNumber: 27,
  title: "Min Stack",
  problem: "Design a stack that supports push, pop, top, and retrieving minimum in O(1).",
  solution: `class MinStack{
    constructor(){this.stack=[];this.min=[];}
    push(x){this.stack.push(x);this.min.push(this.min.length?Math.min(x,this.min[this.min.length-1]):x);}
    pop(){this.stack.pop();this.min.pop();}
    top(){return this.stack[this.stack.length-1];}
    getMin(){return this.min[this.min.length-1];}
  }`,
  approach: "Maintain auxiliary stack for minimums.",
  topic: "Stacks & Queues",
  difficulty: "Medium",
  timeComplexity: "O(1)",
  spaceComplexity: "O(n)",
  tags: ["stack", "design"],
},

{
  dsaNumber: 28,
  title: "Implement Queue using Stacks",
  problem: "Implement a queue using two stacks.",
  solution: `class MyQueue{
    constructor(){this.in=[];this.out=[];}
    push(x){this.in.push(x);}
    pop(){if(!this.out.length) while(this.in.length) this.out.push(this.in.pop()); return this.out.pop();}
    peek(){if(!this.out.length) while(this.in.length) this.out.push(this.in.pop()); return this.out[this.out.length-1];}
    empty(){return !this.in.length && !this.out.length;}
  }`,
  approach: "Use two stacks: in-stack for push, out-stack for pop/peek.",
  topic: "Stacks & Queues",
  difficulty: "Easy",
  timeComplexity: "Amortized O(1)",
  spaceComplexity: "O(n)",
  tags: ["stack", "queue"],
},

// ── Trees ─────────────────────────────────────────────────
{
  dsaNumber: 29,
  title: "Binary Tree Level Order Traversal",
  problem: "Return level order traversal of a binary tree.",
  solution: `function levelOrder(root){
    if(!root) return [];
    const res=[],q=[root];
    while(q.length){
      const size=q.length,level=[];
      for(let i=0;i<size;i++){
        const node=q.shift();
        level.push(node.val);
        if(node.left) q.push(node.left);
        if(node.right) q.push(node.right);
      }
      res.push(level);
    }
    return res;
  }`,
  approach: "BFS using queue.",
  topic: "Trees",
  difficulty: "Medium",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  tags: ["tree", "BFS"],
},

// ── Trees ────────────────────────────────────────────────
{
  dsaNumber: 30,
  title: "Lowest Common Ancestor of BST",
  problem: "Find the lowest common ancestor of two nodes in a BST.",
  solution: `function lowestCommonAncestor(root,p,q){
    while(root){
      if(p.val<root.val && q.val<root.val) root=root.left;
      else if(p.val>root.val && q.val>root.val) root=root.right;
      else return root;
    }
  }`,
  approach: "Traverse down BST; split point is the LCA.",
  topic: "Trees",
  difficulty: "Easy",
  timeComplexity: "O(h)",
  spaceComplexity: "O(1)",
  tags: ["BST","tree","ancestor"],
},

{
  dsaNumber: 31,
  title: "Serialize and Deserialize Binary Tree",
  problem: "Design an algorithm to serialize and deserialize a binary tree.",
  solution: `function serialize(root){
    if(!root) return "null,";
    return root.val+","+
      serialize(root.left)+
      serialize(root.right);
  }
  function deserialize(data){
    const vals=data.split(",");
    let i=0;
    function build(){
      if(vals[i]==="null"){i++;return null;}
      const node={val:parseInt(vals[i++])};
      node.left=build();
      node.right=build();
      return node;
    }
    return build();
  }`,
  approach: "Preorder traversal with null markers.",
  topic: "Trees",
  difficulty: "Hard",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  tags: ["tree","serialization","DFS"],
},

// ── Graphs ───────────────────────────────────────────────
{
  dsaNumber: 32,
  title: "Clone Graph",
  problem: "Clone an undirected graph given a node reference.",
  solution: `function cloneGraph(node){
    if(!node) return null;
    const map=new Map();
    const dfs=(n)=>{
      if(map.has(n)) return map.get(n);
      const copy={val:n.val,neighbors:[]};
      map.set(n,copy);
      for(const nei of n.neighbors)
        copy.neighbors.push(dfs(nei));
      return copy;
    };
    return dfs(node);
  }`,
  approach: "DFS with hash map to avoid cycles.",
  topic: "Graphs",
  difficulty: "Medium",
  timeComplexity: "O(V+E)",
  spaceComplexity: "O(V)",
  tags: ["graph","DFS","clone"],
},

{
  dsaNumber: 33,
  title: "Pacific Atlantic Water Flow",
  problem: "Find cells where water can flow to both Pacific and Atlantic oceans.",
  solution: `function pacificAtlantic(heights){
    const m=heights.length,n=heights[0].length;
    const pac=new Set(),atl=new Set();
    const dfs=(r,c,vis,prev)=>{
      if(r<0||c<0||r>=m||c>=n||vis.has(r+","+c)||heights[r][c]<prev) return;
      vis.add(r+","+c);
      dfs(r+1,c,vis,heights[r][c]);
      dfs(r-1,c,vis,heights[r][c]);
      dfs(r,c+1,vis,heights[r][c]);
      dfs(r,c-1,vis,heights[r][c]);
    };
    for(let i=0;i<m;i++){dfs(i,0,pac,-Infinity);dfs(i,n-1,atl,-Infinity);}
    for(let j=0;j<n;j++){dfs(0,j,pac,-Infinity);dfs(m-1,j,atl,-Infinity);}
    const res=[];
    for(let i=0;i<m;i++)for(let j=0;j<n;j++)
      if(pac.has(i+","+j)&&atl.has(i+","+j)) res.push([i,j]);
    return res;
  }`,
  approach: "DFS from ocean borders; intersection gives result.",
  topic: "Graphs",
  difficulty: "Medium",
  timeComplexity: "O(m·n)",
  spaceComplexity: "O(m·n)",
  tags: ["graph","DFS","matrix"],
},

// ── Dynamic Programming ──────────────────────────────────
{
  dsaNumber: 34,
  title: "Longest Increasing Subsequence",
  problem: "Find length of longest increasing subsequence in array.",
  solution: `function lengthOfLIS(nums){
    const dp=[];
    for(const n of nums){
      let l=0,r=dp.length;
      while(l<r){
        const mid=Math.floor((l+r)/2);
        if(dp[mid]<n) l=mid+1; else r=mid;
      }
      dp[l]=n;
    }
    return dp.length;
  }`,
  approach: "Patience sorting with binary search.",
  topic: "Dynamic Programming",
  difficulty: "Medium",
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  tags: ["DP","binary search","LIS"],
},

{
  dsaNumber: 35,
  title: "Edit Distance",
  problem: "Compute minimum operations to convert word1 to word2.",
  solution: `function minDistance(a,b){
    const m=a.length,n=b.length;
    const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
    for(let i=0;i<=m;i++) dp[i][0]=i;
    for(let j=0;j<=n;j++) dp[0][j]=j;
    for(let i=1;i<=m;i++)
      for(let j=1;j<=n;j++)
        dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:
          1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[m][n];
  }`,
  approach: "Classic DP with 2D table.",
  topic: "Dynamic Programming",
  difficulty: "Hard",
  timeComplexity: "O(m·n)",
  spaceComplexity: "O(m·n)",
  tags: ["DP","string","edit distance"],
},

// ── Sorting & Searching ──────────────────────────────────
{
  dsaNumber: 36,
  title: "Search in Rotated Sorted Array",
  problem: "Search target in rotated sorted array.",
  solution: `function search(nums,target){
    let l=0,r=nums.length-1;
    while(l<=r){
      const mid=Math.floor((l+r)/2);
      if(nums[mid]===target) return mid;
      if(nums[l]<=nums[mid]){
        if(nums[l]<=target&&target<nums[mid]) r=mid-1;
        else l=mid+1;
      }else{
        if(nums[mid]<target&&target<=nums[r]) l=mid+1;
        else r=mid-1;
      }
    }
    return -1;
  }`,
  approach: "Modified binary search.",
  topic: "Sorting & Searching",
  difficulty: "Medium",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  tags: ["binary search","array"],
},

{
  dsaNumber: 37,
  title: "Median of Two Sorted Arrays",
  problem: "Find median of two sorted arrays.",
  solution: `function findMedianSortedArrays(a,b){
    const nums=[...a,...b].sort((x,y)=>x-y);
    const n=nums.length;
    return n%2?nums[Math.floor(n/2)]:(nums[n/2-1]+nums[n/2])/2;
  }`,
  approach: "Merge and sort; optimal uses binary search partition.",
  topic: "Sorting & Searching",
  difficulty: "Hard",
  timeComplexity: "O((m+n) log(m+n))",
  spaceComplexity: "O(m+n)",
  tags: ["array","median","binary search"],
},

// ── Recursion ────────────────────────────────────────────
{
  dsaNumber: 38,
  title: "Generate Parentheses",
  problem: "Generate all combinations of n pairs of parentheses.",
  solution: `function generateParenthesis(n){
    const res=[];
    const backtrack=(s,l,r)=>{
      if(s.length===2*n){res.push(s);return;}
      if(l<n) backtrack(s+"(",l+1,r);
      if(r<l) backtrack(s+")",l,r+1);
    };
    backtrack("",0,0);
    return res;
  }`,
  approach: "Backtracking with constraints on left/right counts.",
  topic: "Recursion",
  difficulty: "Medium",
  timeComplexity: "O(2^n)",
  spaceComplexity: "O(n)",
  tags: ["recursion","backtracking","string"],
},

// ── Recursion ────────────────────────────────────────────
{
  dsaNumber: 39,
  title: "Combination Sum",
  problem: "Given an array of distinct integers and a target, return all unique combinations where the chosen numbers sum to target.",
  solution: `function combinationSum(candidates, target) {
    const res = [];
    const dfs = (start, path, sum) => {
      if (sum === target) { res.push([...path]); return; }
      if (sum > target) return;
      for (let i = start; i < candidates.length; i++) {
        path.push(candidates[i]);
        dfs(i, path, sum + candidates[i]);
        path.pop();
      }
    };
    dfs(0, [], 0);
    return res;
  }`,
  approach: "Backtracking with recursion; allow reuse of same element by not incrementing index.",
  topic: "Recursion",
  difficulty: "Medium",
  timeComplexity: "O(2^n)",
  spaceComplexity: "O(n)",
  tags: ["recursion","backtracking","array"],
},

{
  dsaNumber: 40,
  title: "Letter Combinations of Phone Number",
  problem: "Given a digit string, return all possible letter combinations based on phone keypad mapping.",
  solution: `function letterCombinations(digits) {
    if (!digits.length) return [];
    const map = {2:"abc",3:"def",4:"ghi",5:"jkl",6:"mno",7:"pqrs",8:"tuv",9:"wxyz"};
    const res = [];
    const dfs = (i, path) => {
      if (i === digits.length) { res.push(path); return; }
      for (const c of map[digits[i]]) dfs(i+1, path+c);
    };
    dfs(0,"");
    return res;
  }`,
  approach: "Recursive DFS building strings digit by digit.",
  topic: "Recursion",
  difficulty: "Medium",
  timeComplexity: "O(4^n)",
  spaceComplexity: "O(n)",
  tags: ["recursion","DFS","string"],
},

// ── Hashing ──────────────────────────────────────────────
{
  dsaNumber: 41,
  title: "Longest Consecutive Sequence",
  problem: "Find length of longest consecutive elements sequence in array.",
  solution: `function longestConsecutive(nums) {
    const set = new Set(nums);
    let longest = 0;
    for (const n of set) {
      if (!set.has(n-1)) {
        let length = 1;
        while (set.has(n+length)) length++;
        longest = Math.max(longest,length);
      }
    }
    return longest;
  }`,
  approach: "Use hash set to check consecutive runs starting from sequence heads.",
  topic: "Hashing",
  difficulty: "Medium",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  tags: ["hash set","array","sequence"],
},

{
  dsaNumber: 42,
  title: "Two Sum II - Input Array Sorted",
  problem: "Given sorted array, find two numbers that sum to target.",
  solution: `function twoSumSorted(nums,target){
    let l=0,r=nums.length-1;
    while(l<r){
      const sum=nums[l]+nums[r];
      if(sum===target) return [l+1,r+1];
      if(sum<target) l++; else r--;
    }
  }`,
  approach: "Two-pointer technique on sorted array.",
  topic: "Hashing",
  difficulty: "Easy",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  tags: ["two pointers","array"],
},

// ── Heaps ────────────────────────────────────────────────
{
  dsaNumber: 43,
  title: "Merge K Sorted Lists",
  problem: "Merge k sorted linked lists into one sorted list.",
  solution: `function mergeKLists(lists){
    const arr=[];
    for(const l of lists){
      let node=l;
      while(node){arr.push(node.val);node=node.next;}
    }
    arr.sort((a,b)=>a-b);
    const dummy={next:null}; let curr=dummy;
    for(const v of arr){curr.next={val:v};curr=curr.next;}
    return dummy.next;
  }`,
  approach: "Collect all values, sort, rebuild list. Optimal uses min-heap.",
  topic: "Heaps",
  difficulty: "Hard",
  timeComplexity: "O(N log N)",
  spaceComplexity: "O(N)",
  tags: ["heap","linked list","merge"],
},

{
  dsaNumber: 44,
  title: "Find Median from Data Stream",
  problem: "Design structure to add numbers and find median.",
  solution: `class MedianFinder{
    constructor(){this.arr=[];}
    addNum(num){this.arr.push(num);this.arr.sort((a,b)=>a-b);}
    findMedian(){
      const n=this.arr.length;
      return n%2?this.arr[Math.floor(n/2)]:(this.arr[n/2-1]+this.arr[n/2])/2;
    }
  }`,
  approach: "Maintain sorted array; optimal uses two heaps.",
  topic: "Heaps",
  difficulty: "Hard",
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  tags: ["heap","design","median"],
},

// ── Two Pointers ─────────────────────────────────────────
{
  dsaNumber: 45,
  title: "Container With Most Water",
  problem: "Find max area formed by lines in array.",
  solution: `function maxArea(height){
    let l=0,r=height.length-1,max=0;
    while(l<r){
      max=Math.max(max,(r-l)*Math.min(height[l],height[r]));
      if(height[l]<height[r]) l++; else r--;
    }
    return max;
  }`,
  approach: "Two-pointer shrinking window to maximize area.",
  topic: "Two Pointers",
  difficulty: "Medium",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  tags: ["two pointers","array"],
},

{
  dsaNumber: 46,
  title: "Remove Duplicates from Sorted Array",
  problem: "Remove duplicates in-place from sorted array.",
  solution: `function removeDuplicates(nums){
    let i=0;
    for(const n of nums) if(i<1||n!==nums[i-1]) nums[i++]=n;
    return i;
  }`,
  approach: "Two-pointer overwrite technique.",
  topic: "Two Pointers",
  difficulty: "Easy",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  tags: ["two pointers","array"],
},

// ── Sliding Window ───────────────────────────────────────
{
  dsaNumber: 47,
  title: "Minimum Window Substring",
  problem: "Find smallest substring of s containing all chars of t.",
  solution: `function minWindow(s,t){
    const need={},have={};
    for(const c of t) need[c]=(need[c]||0)+1;
    let l=0,count=0,res="";
    for(let r=0;r<s.length;r++){
      const c=s[r]; have[c]=(have[c]||0)+1;
      if(have[c]===need[c]) count++;
      while(count===Object.keys(need).length){
        if(!res||r-l+1<res.length) res=s.slice(l,r+1);
        have[s[l]]--; if(have[s[l]]<need[s[l]]) count--;
        l++;
      }
    }
    return res;
  }`,
  approach: "Sliding window with hash maps.",
  topic: "Sliding Window",
  difficulty: "Hard",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  tags: ["sliding window","string"],
},

{
  dsaNumber: 48,
  title: "Permutation in String",
  problem: "Check if s2 contains a permutation of s1.",
  solution: `function checkInclusion(s1,s2){
    const need={},have={};
    for(const c of s1) need[c]=(need[c]||0)+1;
    let l=0,count=0;
    for(let r=0;r<s2.length;r++){
      const c=s2[r]; have[c]=(have[c]||0)+1;
      if(have[c]===need[c]) count++;
      if(r-l+1>s1.length){
        if(have[s2[l]]===need[s2[l]]) count--;
        have[s2[l]]--; l++;
      }
      if(count===Object.keys(need).length) return true;
    }
    return false;
  }`,
  approach: "Sliding window of length s1 with frequency maps.",
  topic: "Sliding Window",
  difficulty: "Medium",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  tags: ["sliding window","string"],
},

// ── Backtracking ─────────────────────────────────────────
{
  dsaNumber: 49,
  title: "Sudoku Solver",
  problem: "Write a program to solve a Sudoku puzzle by filling empty cells. The solution must satisfy Sudoku rules.",
  solution: `function solveSudoku(board) {
    const isValid = (r,c,n) => {
      for (let i=0;i<9;i++) {
        if (board[r][i]==n || board[i][c]==n) return false;
        const row=3*Math.floor(r/3)+Math.floor(i/3);
        const col=3*Math.floor(c/3)+i%3;
        if (board[row][col]==n) return false;
      }
      return true;
    };
    const dfs = () => {
      for (let r=0;r<9;r++) {
        for (let c=0;c<9;c++) {
          if (board[r][c]===".") {
            for (let n=1;n<=9;n++) {
              const ch=String(n);
              if (isValid(r,c,ch)) {
                board[r][c]=ch;
                if (dfs()) return true;
                board[r][c]=".";
              }
            }
            return false;
          }
        }
      }
      return true;
    };
    dfs();
  }`,
  approach: "Backtracking with constraint checking for rows, columns, and subgrids.",
  topic: "Backtracking",
  difficulty: "Hard",
  timeComplexity: "O(9^(n))",
  spaceComplexity: "O(1)",
  tags: ["backtracking","recursion","sudoku"],
},

// ── Greedy ───────────────────────────────────────────────
{
  dsaNumber: 50,
  title: "Gas Station",
  problem: "There are n gas stations arranged in a circle. Given gas[i] and cost[i], return the starting station index if you can travel around once, otherwise -1.",
  solution: `function canCompleteCircuit(gas,cost){
    let total=0,tank=0,start=0;
    for(let i=0;i<gas.length;i++){
      total+=gas[i]-cost[i];
      tank+=gas[i]-cost[i];
      if(tank<0){start=i+1;tank=0;}
    }
    return total>=0?start:-1;
  }`,
  approach: "Greedy: if tank drops below 0, reset start to next station. If total gas >= total cost, solution exists.",
  topic: "Greedy",
  difficulty: "Medium",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  tags: ["greedy","array","gas station"],
},


];

// ── More DP, Greedy, Backtracking, etc. ─────────────────────
// (31–50 continue in same style: e.g., Edit Distance, Longest Pal

module.exports = dsaQuestions;
