import reactMixins from '../index';
import { expect } from 'chai';
const TargetA = {
    method1: function() {
        return true;
    }
};

const TargetB = {
    method2: function() {
        return true;
    }
};

const TargetC = {
    mixins: [TargetB],
    method3: function() {
        return true;
    }
}
const TargetD= {
    mixins: [TargetC],
    method4: function() {
        return this;
    }
}

function createInstance(classic: any) {
    var obj = new (new classic().render().type);
    return obj;
}

describe("@reactMixins(...mixins)", () => {
    it("传入空参数", () => {
        @reactMixins(null)
        class TestComponent{

        }
        return true;
    });

    it("单个简单目标对象混合", () => {
        @reactMixins([TargetA])
        class TestComponent{

        }
        return true;
    });
    
    it("多个简单目标对象混合", () => {
        @reactMixins([TargetA, TargetB])
        class TestComponent{

        }
        return true;
    });

    it("多数量/多层依赖目标对象混合", () => {
        @reactMixins([TargetA, TargetD])
        class TestComponent{

        }
        return true;
    });
});

describe('混合结果使用测试', () => {
    it("在类实例中调用混合目标对象的方法", () => {
        @reactMixins([TargetA])
        class TestComponent{
            constructor() {
                (this as any).method1();
            }
        }
        
        return createInstance(TestComponent);
    });

    it("在类实例中调用多混合目标对象的方法", () => {
        @reactMixins([TargetA, TargetD])
        class TestComponent{
            constructor() {
                (this as any).method1();
                (this as any).method2();
                (this as any).method3();
                expect((this as any).method4()).to.be.equal(this);
            }
        }
        return createInstance(TestComponent);
    });
    it("同名方法的调用", () => {
        let result: any = [];
        const TargetA = {
            method1: function (){
                result.push("TargetA.method1");
            }
        };
        const TargetB = {
            method1: function() {
                result.push("TargetB.method1");
            }
        };
        const TargetC = {
            mixins: [TargetB],
            method1: function() {
                result.push("TargetC.method1");
            }
        }

        @reactMixins([TargetA, TargetC])
        class TestComponent{
            constructor() {
                (this as any).method1();
            }
            method1() {
                result.push("TestComponent.method1");
            }
        }
        var obj = createInstance(TestComponent);
        return result.join(',') == [
            "TargetA.method1",
            "TargetB.method1",
            "TargetC.method1",
            "TestComponent.method1"
        ].join(',')
    });
});

