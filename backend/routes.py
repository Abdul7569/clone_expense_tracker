from flask import request, jsonify
from app import app, db
from models import Income, Debt, Expense





@app.route('/set-income', methods=['POST'])
def set_income():
    data = request.get_json()
    hourly_wage = float(data.get('hourlyWage', 0))
    weekly_hours = float(data.get('weeklyHours', 0))

    if hourly_wage <= 0 or weekly_hours <= 0:
        return jsonify({'error': 'Invalid income data'}), 400

    income = Income(hourly_wage=hourly_wage, weekly_hours=weekly_hours)
    db.session.add(income)
    db.session.commit()
    return jsonify({'message': 'Income information saved'}), 200

@app.route('/add-debt', methods=['POST'])
def add_debt():
    data = request.get_json()
    description = data.get('description', '')
    amount = float(data.get('amount', 0))

    if amount <= 0:
        return jsonify({'error': 'Invalid debt amount'}), 400

    debt = Debt(description=description, amount=amount)
    db.session.add(debt)
    db.session.commit()
    return jsonify({'message': 'Debt added successfully'}), 200

@app.route('/add-expense', methods=['POST'])
def add_expense():
    data = request.get_json()
    description = data.get('description', '')
    amount = float(data.get('amount', 0))
    category = data.get('category', '')

    if amount <= 0:
        return jsonify({'error': 'Invalid expense amount'}), 400

    expense = Expense(description=description, amount=amount, category=category)
    db.session.add(expense)
    db.session.commit()
    return jsonify({'message': 'Expense added successfully'}), 200

@app.route('/calculate-repayment', methods=['GET'])
def calculate_repayment_time():
    total_debt = db.session.query(db.func.sum(Debt.amount)).scalar() or 0
    total_expenses = db.session.query(db.func.sum(Expense.amount)).scalar() or 0
    income = Income.query.order_by(Income.id.desc()).first()

    if not income:
        return jsonify({'error': 'Please enter your income information first.'}), 400

    weekly_income = income.hourly_wage * income.weekly_hours
    monthly_income = 4 * weekly_income
    net_monthly_income = monthly_income - total_expenses

    if net_monthly_income <= 0:
        return jsonify({'message': 'Your expenses are greater than or equal to your income.'}), 400

    repayment_time_months = total_debt / net_monthly_income
    repayment_time_weeks = repayment_time_months * (365.25 / 12 / 7)
    repayment_time_days = repayment_time_weeks * 7

    return jsonify({
        'repayment_time_months': round(repayment_time_months, 2),
        'repayment_time_weeks': round(repayment_time_weeks, 2),
        'repayment_time_days': round(repayment_time_days, 2)
    }), 200
