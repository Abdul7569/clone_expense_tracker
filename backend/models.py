from app import db

# Income model (store user income)
class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hourly_wage = db.Column(db.Float, nullable=False)
    weekly_hours = db.Column(db.Float, nullable=False)

# Debt model (store debts)
class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

# Expense model (store expenses)
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
