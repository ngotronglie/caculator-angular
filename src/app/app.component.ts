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
  history: string[] = [];             // Mảng lưu lịch sử các phép tính
  lastResult = '';            // Kết quả tính toán cuối cùng
  secondNumber = '';          // Số thứ 2 trong lần bấm dấu "=" tiếp theo
  lastOperation = '';         // Phép toán trước đó, phục vụ tính toán tiếp theo
  predictedResult = '';       // Thêm biến mới để lưu kết quả dự đoán
  showEquals = false;  // Thêm biến để kiểm soát hiển thị dấu bằng
  displayExpression = ''; // Biến lưu trữ phép tính đầy đủ sau khi bấm =

  // Xử lý khi người dùng nhấn số
  onNumberClick(number: string) {
    if (this.currentNumber === '0') {
      this.currentNumber = number;        // Nếu đang là 0 thì thay thế
    } else {
      this.currentNumber += number;       // Nếu khác 0 thì nối thêm số
    }
    this.updatePrediction();
  }

  // Xử lý khi người dùng chọn phép tính (+, -, *, /)
  onOperationClick(op: string) {
    if (this.currentNumber === '0') return;

    if (this.previousNumber !== '') {
      this.calculate();
    }

    this.operation = op;
    this.lastOperation = op;
    this.previousNumber = this.currentNumber;
    this.currentNumber = '0';
    this.predictedResult = '';
    this.showEquals = false;  // Ẩn dấu bằng khi chọn phép tính mới
    this.displayExpression = ''; // Xóa phép tính hiển thị
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

    // Lưu trữ phép tính đầy đủ trước khi reset
    this.displayExpression = `${this.previousNumber} ${this.operation} ${this.currentNumber} =`;

    this.currentNumber = result.toString();          // Hiển thị kết quả
    this.lastResult = result.toString();             // Lưu kết quả cuối cùng
    this.showEquals = true;  // Hiển thị dấu bằng
    this.previousNumber = '';                        // Reset để chuẩn bị cho phép tính mới
    this.operation = '';
    this.predictedResult = ''; // Ẩn kết quả dự đoán
  }

  // Xử lý khi nhấn dấu "="
  onEqualsClick() {
    if (this.operation === '') {
      // Nếu không có phép toán hiện tại, sử dụng lại phép toán cũ (cho trường hợp bấm = nhiều lần)
      if (this.lastResult !== '') {
        if (this.secondNumber !== '') {
           // Lưu lại phép tính đầy đủ cho trường hợp bấm = nhiều lần
           this.displayExpression = `${this.lastResult} ${this.lastOperation} ${this.secondNumber} =`;

          this.previousNumber = this.lastResult;
          this.currentNumber = this.secondNumber;
          this.operation = this.lastOperation;
          this.calculate(); // calculate() sẽ set showEquals = true

           // Sau khi calculate, previousNumber và operation bị reset, nên cần lưu lại secondNumber
           // Nhưng ở đây chỉ cần hiển thị, calculate() đã lưu vào history
           // Cần cập nhật lại logic calculate hoặc onEqualsClick cho trường hợp bấm = liên tiếp
           // Hiện tại calculate() đã thêm vào history, nên logic hiển thị cần dựa vào state

        } else {
           // Trường hợp chỉ có lastResult, bấm = không làm gì
           return;
        }
      } else {
         // Trường hợp không có gì cả, bấm = không làm gì
         return;
      }
    } else {
      this.secondNumber = this.currentNumber;        // Lưu lại số hiện tại để tái sử dụng
      this.calculate();                              // Tính toán, calculate() sẽ set showEquals = true và displayExpression
    }
    // Không reset previousNumber, operation, currentNumber ở đây nữa, để calculate() làm
    // this.predictedResult = ''; // calculate() đã làm
    // this.showEquals = true; // calculate() đã làm
  }


  // Thêm dấu "." nếu chưa có trong số hiện tại
  onDecimalClick() {
    if (!this.currentNumber.includes('.')) {
      this.currentNumber += '.';
    }
  }

  // Xóa lịch sử phép tính
  clearHistory() {
    let IsConfirm = confirm("bạn chắc chắn xóa lịch sử")
    if (IsConfirm) {
      this.history = []
    }
  }

  // Thêm hàm mới để tính toán dự đoán
  private updatePrediction() {
    this.showEquals = false; // Ẩn dấu bằng khi nhập số để tính dự đoán
    this.displayExpression = ''; // Xóa phép tính hiển thị

    if (this.previousNumber && this.operation && this.currentNumber !== '0') {
      const prev = parseFloat(this.previousNumber);
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
          if (current !== 0) {
            result = prev / current;
          }
          break;
      }
      this.predictedResult = result.toString();
    } else {
      this.predictedResult = '';
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
    this.predictedResult = '';
    this.showEquals = false;  // Ẩn dấu bằng
    this.displayExpression = ''; // Xóa phép tính hiển thị
  }

}
