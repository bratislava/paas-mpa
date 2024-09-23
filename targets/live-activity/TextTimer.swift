import SwiftUI

struct  TextTimer: View {
    private static func maxStringFor(_ time: TimeInterval) -> String {
        if time < 600 { // 9:99
            return "0:00"
        }
        
        if time < 3600 { // 59:59
            return "00:00"
        }
        
        if time < 36000 { // 9:59:59
            return "0:00:00"
        }
        
        return "00:00:00" // 99:59:59
    }
    
    init(_ date: Date, font: UIFont, width: CGFloat? = nil) {
        self.date = date
        self.font = font
        
        if let width = width {
            self.width = width
        } else {
            let fontAttributes = [NSAttributedString.Key.font: font]
            let time = date.timeIntervalSinceNow
            let maxString = Self.maxStringFor(time)
            self.width = (maxString as NSString).size(withAttributes: fontAttributes).width
        }
    }
    
    let date: Date
    let font: UIFont
    let width: CGFloat
    
    var body: some View {
        Text(timerInterval: Date.now...date, countsDown: true)
            .font(Font(font))
            .frame(width: width > 0 ? width : nil)
            .minimumScaleFactor(0.5)
            .lineLimit(1)
    }
}

