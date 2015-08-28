import expect from 'expect';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import React from 'react/addons';
import MDEditor from '../src/MDEditor';

const { TestUtils } = React.addons;

function setup() {
  const props = {
    onChange: expect.createSpy(),
    options: {},
    path: '',
    value: ''
  };

  const renderer = TestUtils.createRenderer();
  renderer.render(<MDEditor {...props} />);
  const output = renderer.getRenderOutput();

  return {
    props: props,
    output: output,
    renderer: renderer
  };
}

describe('MDEditor', () => {
  ExecutionEnvironment.canUseDOM = true;
  it('should render container coorectly', () => {
    const { output } = setup();

    expect(output.type).toBe('div');
    expect(output.props.className).toBe('MDEditor');
  });

  it('should render toolbar correctly', () => {
    const { output } = setup();
    const [toolbar] = output.props.children;

    expect(toolbar.type).toBe('div');
    expect(toolbar.props.className).toBe('MDEditor_toolbar');
    expect(toolbar.props.children.length).toBe(8);

    const [h1, h2, h3, bold, italic, olist, ulist, quote] =
      toolbar.props.children;

    expect(h1.props.title).toBe('h1');
    expect(h2.props.title).toBe('h2');
    expect(h3.props.title).toBe('h3');
    expect(bold.props.title).toBe('bold');
    expect(italic.props.title).toBe('italic');
    expect(olist.props.title).toBe('oList');
    expect(ulist.props.title).toBe('uList');
    expect(quote.props.title).toBe('quote');
  });

  it('should render editor correctly', () => {
    const { output } = setup();
    const [, editor] = output.props.children;

    expect(editor.type).toBe('div');
    expect(editor.props.className).toBe('MDEditor_editor');
    
    expect(editor.props.children.type).toBe('textarea');

  });
});
