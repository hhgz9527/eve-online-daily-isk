
export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    title: 'EVE 账目助手',
    subtitle: '财务情报系统',
    langName: 'English',
    tabs: {
      input: '录入',
      dashboard: '概览',
      calendar: '日历',
      logs: '流水'
    },
    input: {
      title: '粘贴钱包记录',
      desc: '在 EVE 客户端中打开“钱包” - “交易记录”，选中行并复制（Ctrl+C），然后粘贴到下方。',
      placeholder: '2026.02.01 03:48	合同价格	-4,520,000,000 星币	...',
      processBtn: '解析并合并记录',
      clearBtn: '重置数据',
      localTip: '本地处理',
      localDesc: '所有数据均在您的浏览器本地解析，不会上传至服务器。',
      multiCharTip: '支持多角色',
      multiCharDesc: '您可以分多次粘贴不同角色的钱包流水。'
    },
    dashboard: {
      income: '总收入',
      expense: '总支出',
      net: '净利润',
      trendTitle: '每日收支趋势',
      netTitle: '净资产每日变化',
      charTitle: '角色统计',
      incomeLabel: '收入',
      expenseLabel: '支出',
      netLabel: '净收益',
      tableChar: '角色名',
      tableIncome: '累计收入',
      tableExpense: '累计支出',
      tableNet: '净收支'
    },
    calendar: {
      title: '收支日历',
      selectMonth: '选择月份',
      weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      tipTitle: '提示:',
      tipDesc: '每日金额为该自然日（EVE 时间）内所有钱包变动的净值合计。绿色表示净收入，红色表示净支出。'
    },
    logs: {
      title: '账单明细',
      count: '条记录',
      time: '时间',
      type: '类型',
      character: '角色',
      amount: '金额',
      description: '描述'
    },
    common: {
      isk: '星币',
      unknownChar: '未知飞行员'
    }
  },
  en: {
    title: 'EVE Ledger',
    subtitle: 'Financial Intelligence',
    langName: '中文',
    tabs: {
      input: 'Input',
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      logs: 'Logs'
    },
    input: {
      title: 'Paste Wallet Logs',
      desc: 'Open "Wallet" - "Journal" in EVE client, select rows and copy (Ctrl+C), then paste below.',
      placeholder: '2026.02.01 03:48	Contract Price	-4,520,000,000 ISK	...',
      processBtn: 'Process & Merge Logs',
      clearBtn: 'Reset Data',
      localTip: 'Local Processing',
      localDesc: 'All data is processed locally in your browser for privacy.',
      multiCharTip: 'Multi-Character Support',
      multiCharDesc: 'Paste logs from different characters separately; they will be merged.'
    },
    dashboard: {
      income: 'Total Income',
      expense: 'Total Expense',
      net: 'Net Profit',
      trendTitle: 'Daily Income/Expense Trend',
      netTitle: 'Daily Net Worth Change',
      charTitle: 'Character Statistics',
      incomeLabel: 'Income',
      expenseLabel: 'Expense',
      netLabel: 'Net Profit',
      tableChar: 'Character',
      tableIncome: 'Total Income',
      tableExpense: 'Total Expense',
      tableNet: 'Net'
    },
    calendar: {
      title: 'Ledger Calendar',
      selectMonth: 'Select Month',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      tipTitle: 'Tip:',
      tipDesc: 'Daily amounts represent the net sum of all wallet changes for that EVE day. Green is profit, red is loss.'
    },
    logs: {
      title: 'Transaction Details',
      count: 'entries',
      time: 'Time',
      type: 'Type',
      character: 'Character',
      amount: 'Amount',
      description: 'Description'
    },
    common: {
      isk: 'ISK',
      unknownChar: 'Unknown Pilot'
    }
  }
};

export const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('eve_ledger_lang') as Language;
  if (saved && (saved === 'zh' || saved === 'en')) return saved;
  
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('zh') ? 'zh' : 'en';
};
