using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class RiskCard : MonoBehaviour, IPointerClickHandler
{
    public int scope;
    public int quality;
    public int time;
    public int money;
    public bool mitigated = false;
    public bool selected = false;
    private GameManager gameManager;
    private Image image;

    private void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        image = GetComponent<Image>();
    }

    public void Select()
    {
        if (mitigated)
        {
            selected = false;
        }
        else
        {
            selected = !selected;
        }
    }

    public void Deletion()
    {
        Destroy(gameObject);
    }

    public void OnPointerClick(PointerEventData eventData)
    {
        if (gameManager != null)
        {
            //gameManager.SetSelectedRiskCard(this);
        }
    }

    public void Mitigated()
    {
        mitigated = true;
        selected = false;
        SetTransparency(0.5f); // Set transparency to 50%
    }

    private void SetTransparency(float alpha)
    {
        if (image != null)
        {
            Color color = image.color;
            color.a = alpha;
            image.color = color;
        }
    }
}
