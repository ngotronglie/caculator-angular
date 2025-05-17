// Import các module cần thiết từ Angular
import { Component } from '@angular/core';            // Dùng để khai báo component
import { RouterOutlet } from '@angular/router';       // Dùng để điều hướng router
import { CommonModule } from '@angular/common';       // Module chung (ngIf, ngFor,...)
import { FormsModule } from '@angular/forms';         // Hỗ trợ binding form

// Định nghĩa metadata cho component
@Component({
  selector: 'app-root',                               // Tên selector sử dụng trong HTML
  standalone: true,                                   // Đây là một Standalone Component
  imports: [RouterOutlet, CommonModule, FormsModule], // Import các module dùng trong template
  templateUrl: './app.component.html',                // Liên kết đến file HTML
  styleUrl: './app.component.scss'                    // Liên kết đến file SCSS
})
export class AppComponent {
  // Khai báo biến dùng cho logic xử lý
  currentNumber = '0';        // Số đang hiển thị / người dùng đang nhập
  previousNumber = '';        // Số trước đó (trong phép tính)
  operation = '';             // Phép toán đang thực hiện (+, -, *, /)
  history: string[] = [];     // Mảng lưu lịch sử các phép tính
  lastResult = '';            // Kết quả tính toán cuối cùng
  secondNumber = '';          // Số thứ 2 trong lần bấm dấu "=" tiếp theo
  lastOperation = '';         // Phép toán trước đó, phục vụ tính toán tiếp theo

  // Xử lý khi người dùng nhấn số
  onNumberClick(number: string) {
    if (this.currentNumber === '0') {
      this.currentNumber = number;        // Nếu đang là 0 thì thay thế
    } else {
      this.currentNumber += number;       // Nếu khác 0 thì nối thêm số
    }
  }

  // Xử lý khi người dùng chọn phép tính (+, -, *, /)
  onOperationClick(op: string) {
    if (this.currentNumber === '0') return;          // Nếu chưa nhập số thì bỏ qua

    if (this.previousNumber !== '') {
      this.calculate();                              // Nếu đã có phép tính trước đó thì tính trước
    }

    this.operation = op;                             // Lưu phép toán hiện tại
    this.lastOperation = op;                         // Lưu lại để dùng khi bấm "=" nhiều lần
    this.previousNumber = this.currentNumber;        // Chuyển số hiện tại sang làm số trước
    this.currentNumber = '0';                        // Reset số hiện tại để nhập số mới
  }

  // Hàm thực hiện phép tính
  calculate() {
    const prev = parseFloat(this.previousNumber);    // Ép kiểu chuỗi thành số thực
    const current = parseFloat(this.currentNumber);
    let result = 0;

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          alert('Cannot divide by zero!');           // Kiểm tra chia cho 0
          return;
        }
        result = prev / current;
        break;
    }

    const calculation = `${this.previousNumber} ${this.operation} ${this.currentNumber} = ${result}`;
    this.history.unshift(calculation);               // Thêm phép tính vào đầu mảng lịch sử
    this.currentNumber = result.toString();          // Hiển thị kết quả
    this.lastResult = result.toString();             // Lưu kết quả cuối cùng
    console.log( this.currentNumber)
    console.log(this.lastResult);
    this.previousNumber = '';                        // Reset để chuẩn bị cho phép tính mới
    this.operation = '';
  }

  // Xử lý khi nhấn dấu "="
  onEqualsClick() {
    if (this.operation === '') {
      // Nếu không có phép toán hiện tại, sử dụng lại phép toán cũ
      if (this.lastResult !== '') {
        if (this.secondNumber !== '') {
          this.previousNumber = this.lastResult;
          this.currentNumber = this.secondNumber;
          this.operation = this.lastOperation;
          this.calculate();
        }
      }
    } else {
      this.secondNumber = this.currentNumber;        // Lưu lại số hiện tại để tái sử dụng
      this.calculate();                              // Tính toán
    }
  }

  // Xóa toàn bộ input và phép toán
  clear() {
    this.currentNumber = '0';
    this.previousNumber = '';
    this.operation = '';
    this.lastResult = '';
    this.secondNumber = '';
    this.lastOperation = '';
  }

  // Thêm dấu "." nếu chưa có trong số hiện tại
  onDecimalClick() {
    if (!this.currentNumber.includes('.')) {
      this.currentNumber += '.';
    }
  }

  // Xóa lịch sử phép tính
  clearHistory() {
    this.history = [];
  }
}
