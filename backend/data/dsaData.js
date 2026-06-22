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
];

module.exports = dsaQuestions;
