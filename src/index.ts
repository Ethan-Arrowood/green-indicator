import { FASTElement, customElement, attr, html, css } from "@microsoft/fast-element";
import LeafIcon from '@fluentui/svg-icons/icons/leaf_one_16_filled.svg'

type quality = 'good' | 'better' | 'best'

const data = {
  'us-central': 'good',
  'us-east': 'better',
  'us-west': 'best'
} as const;

const fakeApi = {
  fetch: async (location: string) => {
    if (location === 'us-central' || location === 'us-east' || location === 'us-west') {
      return {
        code: 200,
        data: data[location]
      }
    }

    return {
      code: 500,
      message: `Invalid location: ${location}`
    }
  }
};

const template = html<GreenIndiciator>`
  <span class=${_ => _.quality}>${LeafIcon}</span>
`

const styles = css`
  .good {
    color: red;
  }
  .better {
    color: yellow;
  }
  .best {
    color: green;
  }
`

@customElement({
  name: 'green-indicator',
  template,
  styles
})
export class GreenIndiciator extends FASTElement {
  @attr location: string = 'us-central'
  @attr quality: quality = 'good'

  connectedCallback () {
    fakeApi.fetch(this.location)
      .then((response) => {
        if (response.code === 200) {
          this.quality = response.data as quality
        } else {
          console.error(response.message)
        }
      })
  }
}