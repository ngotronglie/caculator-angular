// Import các module cần thiết từ Angular
import { Component } from '@angular/core';            // Dùng để khai báo Component
import { RouterOutlet } from '@angular/router';       // Hỗ trợ định tuyến (Routing)
import { CommonModule } from '@angular/common';       // Chứa các directive như *ngIf, *ngFor,...
import { FormsModule } from '@angular/forms';         // Hỗ trợ xử lý form và binding dữ liệu

// Định nghĩa component chính của ứng dụng
@Component({
  selector: 'app-root',                               // Tên selector sử dụng trong HTML
  standalone: true,                                   // Component dạng độc lập (Standalone Component)
  imports: [RouterOutlet, CommonModule, FormsModule], // Các module cần dùng trong template
  templateUrl: './app.component.html',                // Đường dẫn đến file HTML template
  styleUrl: './app.component.scss'                    // Đường dẫn đến file style SCSS
})
export class AppComponent {
  // ============================ Khai báo các biến =============================
  currentNumber = '0';        // Số hiện tại người dùng đang nhập
  previousNumber = '';        // Số trước đó (sử dụng khi tính toán)
  operation = '';             // Phép toán được chọn: + - * /
  history: string[] = [];     // Lưu lịch sử các phép tính
  lastResult = '';            // Kết quả cuối cùng sau khi tính
  secondNumber = '';          // Số thứ hai cho các phép tính lặp khi bấm "=" nhiều lần
  lastOperation = '';         // Lưu phép toán gần nhất để xử lý khi bấm "=" nhiều lần
  predictedResult = '';       // Hiển thị kết quả dự đoán (khi nhập xong 2 số)
  showEquals = false;         // Kiểm soát hiển thị dấu "=" trên UI
  displayExpression = '';     // Hiển thị biểu thức đầy đủ sau khi bấm "="

  // ============================ Các hàm xử lý =============================

  /**
   * Xử lý khi người dùng nhấn số
   */
  onNumberClick(number: string) {
    if (this.currentNumber === '0') {
      this.currentNumber = number;  // Nếu hiện tại là "0", thay bằng số mới
    } else {
      this.currentNumber += number; // Nếu đã có số, thêm số tiếp theo
    }
    this.updatePrediction(); // Cập nhật kết quả dự đoán khi nhập số
  }

  /**
   * Xử lý khi người dùng chọn phép toán (+, -, *, /)
   */
  onOperationClick(op: string) {
    if (this.currentNumber === '0') return; // Không làm gì nếu chưa nhập số

    // Nếu đã có phép toán trước đó => thực hiện tính trước
    if (this.previousNumber !== '') {
      this.calculate();
    }

    // Thiết lập thông tin phép toán mới
    this.operation = op;
    this.lastOperation = op;
    this.previousNumber = this.currentNumber;
    this.currentNumber = '0';
    this.predictedResult = '';
    this.showEquals = false;
    this.displayExpression = '';
  }

  /**
   * Hàm thực hiện phép tính toán (+, -, *, /)
   */
  calculate() {
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
        if (current === 0) {
          alert('Cannot divide by zero!'); // Cảnh báo chia cho 0
          return;
        }
        result = prev / current;
        break;
    }

    // Tạo biểu thức hiển thị và lưu lịch sử
    const calculation = `${this.previousNumber} ${this.operation} ${this.currentNumber} = ${result}`;
    this.history.unshift(calculation);

    // Cập nhật trạng thái sau tính toán
    this.displayExpression = `${this.previousNumber} ${this.operation} ${this.currentNumber} =`;
    this.currentNumber = result.toString();
    this.lastResult = result.toString();
    console.log("last result: " + this.lastResult);
    console.log("currentNumber: " + this.currentNumber);
    this.showEquals = true;

    // Reset cho phép  tính tiếp theo
    this.previousNumber = '';
    this.operation = '';
    this.predictedResult = '';
  }

  /**
   * Xử lý khi người dùng nhấn "="
   * Hỗ trợ tính tiếp nếu nhấn "=" nhiều lần
   */
  onEqualsClick() {
    // Nếu không có phép toán hiện tại
    if (this.operation === '') {
      if (this.lastResult !== '') {
        if (this.secondNumber !== '') {
          // Sử dụng lại lastResult và secondNumber để tiếp tục tính
          this.displayExpression = `${this.lastResult} ${this.lastOperation} ${this.secondNumber} =`;
          this.previousNumber = this.lastResult;
          this.currentNumber = this.secondNumber;
          this.operation = this.lastOperation;
          this.calculate();
        } else {
          // Trường hợp không đủ thông tin để tính tiếp
          return;
        }
      } else {
        return; // Không có gì để tính
      }
    } else {
      // Lưu số hiện tại làm secondNumber, rồi thực hiện phép tính
      this.secondNumber = this.currentNumber;
      this.calculate();
    }
  }

  /**
   * Thêm dấu "." nếu chưa có trong số hiện tại
   */
  onDecimalClick() {
    if (!this.currentNumber.includes('.')) {
      this.currentNumber += '.';
    }
  }

  /**
   * Xóa toàn bộ lịch sử phép tính
   */
  clearHistory() {
    let IsConfirm = confirm("Bạn chắc chắn muốn xóa lịch sử?");
    if (IsConfirm) {
      this.history = [];
    }
  }

  /**
   * Cập nhật kết quả dự đoán khi người dùng nhập số
   */
  private updatePrediction() {
    this.showEquals = false;
    this.displayExpression = '';

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

      this.predictedResult = result.toString(); // Hiển thị kết quả dự đoán
    } else {
      this.predictedResult = '';
    }
  }

  /**
   * Xóa toàn bộ dữ liệu hiện tại (reset máy tính)
   */
  clear() {
    this.currentNumber = '0';
    this.previousNumber = '';
    this.operation = '';
    this.lastResult = '';
    this.secondNumber = '';
    this.lastOperation = '';
    this.predictedResult = '';
    this.showEquals = false;
    this.displayExpression = '';
  }
}
