import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState('expense');
  const [budget, setBudget] = useState({});

  const categories = ['food', 'transport', 'entertainment', 'utilities', 'healthcare', 'shopping', 'investment', 'others'];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    const savedBudget = localStorage.getItem('budget');
    if (saved) setTransactions(JSON.parse(saved));
    if (savedBudget) setBudget(JSON.parse(savedBudget));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  const addTransaction = () => {
    if (!amount || !description) {
      alert('Please fill all fields');
      return;
    }

    const newTransaction = {
  id: Date.now(),
  amount: parseFloat(amount),
  description,
  category: type === 'expense' ? category : null,  // ← Only add category for expenses
  type,
  date: new Date().toLocaleDateString()
};

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setDescription('');
    setCategory('food');
    setType('expense');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = categories.reduce((acc, cat) => {
    acc[cat] = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {});

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Budget Tracker</h1>
      </header>

      <div className="container">
        {/* Balance Section */}
        <div className="balance-section">
          <div className="balance-card income">
            <h3>Income</h3>
            <p className="amount">₹ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="balance-card expense">
            <h3>Expenses</h3>
            <p className="amount">₹ {totalExpense.toFixed(2)}</p>
          </div>
          <div className="balance-card balance">
            <h3>Balance</h3>
            <p className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
              ₹ {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add Transaction */}
        <div className="add-transaction">
          <h2>Add Transaction</h2>
          <div className="form-group">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <select value={type} onChange={(e) => setType(e.target.value)} className="select">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {type === 'expense' && (
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="select">
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button onClick={addTransaction} className="btn-add">
            + Add Transaction
          </button>
        </div>

        {/* Expense by Category */}
        {Object.values(expenseByCategory).some(v => v > 0) && (
          <div className="category-breakdown">
            <h2>Expense Breakdown</h2>
            <div className="category-list">
              {categories.map(cat => (
                expenseByCategory[cat] > 0 && (
                  <div key={cat} className="category-item">
                    <span className="cat-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <span className="cat-amount">₹ {expenseByCategory[cat].toFixed(2)}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="transactions">
          <h2>Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="empty">No transactions yet. Start by adding one!</p>
          ) : (
            <div className="transaction-list">
              {transactions.map(t => (
                <div key={t.id} className={`transaction-item ${t.type}`}>
                  <div className="trans-info">
                    <div>
                      <p className="trans-desc">{t.description}</p>
                      <p className="trans-meta">
                        {t.date} {t.category && `• ${t.category}`}
                      </p>
                    </div>
                  </div>
                  <div className="trans-amount">
                    <span className={`amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'} ₹ {t.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="btn-delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}